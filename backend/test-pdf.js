import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { PDFParse } = require('pdf-parse');

const makePdf = (text) => {
  const header = "%PDF-1.4\n";
  const obj1 = "1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n";
  const obj2 = "2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n";
  
  const font = "<<\n/Type /Font\n/Subtype /Type1\n/BaseFont /Helvetica\n/Encoding /WinAnsiEncoding\n>>";
  const obj3 = `3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/Resources <<\n/Font <<\n/F1 ${font}\n>>\n>>\n/MediaBox [0 0 595 842]\n/Contents 4 0 R\n>>\nendobj\n`;
  
  const stream = `BT\n/F1 12 Tf\n100 700 Td\n(${text}) Tj\nET`;
  const obj4 = `4 0 obj\n<<\n/Length ${stream.length}\n>>\nstream\n${stream}\nendstream\nendobj\n`;
  
  // Calculate offsets
  const offset1 = header.length;
  const offset2 = offset1 + obj1.length;
  const offset3 = offset2 + obj2.length;
  const offset4 = offset3 + obj3.length;
  const offsetRef = offset4 + obj4.length;
  
  const pad = (num) => String(num).padStart(10, '0');
  
  const xref = `xref\n0 5\n0000000000 65535 f \n${pad(offset1)} 00000 n \n${pad(offset2)} 00000 n \n${pad(offset3)} 00000 n \n${pad(offset4)} 00000 n \n`;
  const trailer = `trailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n${offsetRef}\n%%EOF\n`;
  
  const pdfString = header + obj1 + obj2 + obj3 + obj4 + xref + trailer;
  return Buffer.from(pdfString, 'binary');
};

const testPdfParser = async () => {
  try {
    const buffer = makePdf("Advanced React developer with beginner Python");
    const parser = new PDFParse({ data: buffer });
    const data = await parser.getText();
    console.log("Parsed PDF Text:", data.text);
    console.log("Parsed PDF Text includes 'React'? :", data.text.includes("React"));
  } catch (err) {
    console.error("PDF Parsing failed:", err);
  }
};

testPdfParser();
