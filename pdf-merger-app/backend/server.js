import express from 'express';
import multer from 'multer';
import PDFMerger from 'pdf-merger-js';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module workaround for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'uploads')));

const upload = multer({ dest: 'uploads/' });

app.post('/merge', upload.array('pdfs'), async (req, res) => {
  const merger = new PDFMerger();

  for (const file of req.files) {
    await merger.add(file.path);
  }

  const outputPath = `uploads/merged_${Date.now()}.pdf`;
  await merger.save(outputPath);

  req.files.forEach(file => fs.unlinkSync(file.path));
  res.download(outputPath, () => {
    fs.unlinkSync(outputPath);
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
