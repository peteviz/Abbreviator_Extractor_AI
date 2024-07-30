import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { Document, Packer, Paragraph, TextRun } from 'docx';

const exec = promisify(require('child_process').exec);

const extractAbbreviations = async (filePath: string): Promise<string> => {
  const scriptPath = path.join(process.cwd(), 'src', 'scripts', 'extractor.py');
  const command = `python ${scriptPath} ${filePath}`;

  console.log('Running command:', command);

  try {
    const { stdout, stderr } = await exec(command);
    console.log('Command stdout:', stdout);
    if (stderr) {
      console.error('Command stderr:', stderr);
      throw new Error(stderr);
    }
    return stdout.trim(); // No need to JSON.parse here as we're directly using it
  } catch (error) {
    console.error('Error running script:', error);
    throw new Error('Error extracting abbreviations');
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};

const parseForm = (req: NextApiRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const form = formidable({
    uploadDir: path.join(process.cwd(), 'uploads'),
    keepExtensions: true,
    maxFileSize: 50 * 1024 * 1024, // 50 MB file size limit
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { fields, files } = await parseForm(req);
    const fileArray = files.file as formidable.File[];

    if (!fileArray || !Array.isArray(fileArray) || fileArray.length === 0) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const file = fileArray[0];
    const filePath = file.filepath;

    const abbreviations = await extractAbbreviations(filePath);

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [new Paragraph({ children: [new TextRun(abbreviations)] })],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    fs.unlinkSync(filePath);

    if (req.headers.accept?.includes('application/json')) {
      try {
        // Parse the JSON here
        const parsedAbbreviations = JSON.parse(abbreviations);
        res.status(200).json({ result: parsedAbbreviations });
      } catch (jsonError) {
        console.error('Error parsing JSON:', jsonError);
        res.status(500).json({ error: 'Invalid JSON from Python script' });
      }
    } else {
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', 'attachment; filename=abbreviations.docx');
      res.send(buffer);
    }
  } catch (error) {
    console.error('Upload processing error:', error);
    res.status(500).json({ error: 'Failed to process file' });
  }
};
