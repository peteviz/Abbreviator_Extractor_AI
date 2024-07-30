declare module 'docx' {
    export class Document {
      // Add the properties and methods you need from `docx`
    }
    
    export class Packer {
      static toBuffer(document: Document): Promise<Buffer>;
    }
    
    export class Paragraph {
      constructor(content: any);
    }
    
    export class TextRun {
      constructor(content: string);
    }
  }
  