import { useState, ChangeEvent, FormEvent } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import ContentCopyIcon from '@mui/icons-material/ContentCopy'; 
import CircularProgress from '@mui/material/CircularProgress';
import StarsIcon from '@mui/icons-material/Stars';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar'; 

interface resultType {
  [key: string]: string;
}
const Home = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<resultType | null>(null);
  const [tooltipText, setTooltipText] = useState('Copy to clipboard');
  const [loading, setLoading] = useState(false);



  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json', 
        },
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const data = await response.json();
      setResult(data.result); 
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleCopyToClipboard = () => {
    const textToCopy = Object.entries(result || {})
      .map(([key, value]) => `${key}: ${String(value)}`)
      .join('\n');
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setTooltipText('Copied!');
        setTimeout(() => setTooltipText('Copy to clipboard'), 2000); // Reset tooltip text after 2 seconds
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  };
  return (
    <div className="flex flex-col items-center min-h-screen bg-red-100">
      <Navbar /> 
      <div className="flex flex-col items-center min-h-screen py-2 justify-center">
      <h1 className="text-4xl font-bold mb-4 roboto-font">Abbreviation Extractor</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
        <input
          type="file"
          accept=".doc, .docx"
          onChange={handleFileChange}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <Button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-600" variant="contained" color="primary" size='medium'>
          Upload
        </Button>
      </form>
      {loading ? (
          <div className="flex flex-col items-center mt-6">
            <div className="text-lg animate-pulse">Extracting...</div>
          </div>
        ) : (
      <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="mt-6 bg-white p-6 rounded-lg shadow-md w-full max-w-xl"
            >
              <h2 className="text-2xl font-bold mb-4">Extracted Abbreviations:</h2>
              {Object.entries(result).map(([key, value]) => (
                <div key={key}>
                  <strong>{key}:</strong> {String(value)}
                </div>
              ))}
              <div className="flex justify-end mt-4">
                <Tooltip title={tooltipText} arrow>
                  <Button
                    variant="text"
                    style={{ color: 'gray' }}
                    startIcon={<ContentCopyIcon />}
                    onClick={handleCopyToClipboard}
                    size="small"
                  >
                    Copy
                  </Button>
                </Tooltip>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        )}
      </div>
    </div>
  );
};
export default Home;
