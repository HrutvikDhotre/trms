const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });
const cors = require('cors');
app.use(cors());

mongoose.connect('mongodb://localhost:27017/fileStorage');
const db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to MongoDB');
});

const fileSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  size: Number,
  filePath: String
});

const File = mongoose.model('File', fileSchema);

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, 'uploads', req.file.originalname);
    fs.renameSync(tempPath, targetPath);
    const newFile = new File({
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      size: req.file.size,
      filePath: targetPath
    });
    await newFile.save();
    console.log('File uploaded successfully:', req.file.originalname);
    res.status(201).send('File uploaded successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

app.get('/files', async (req, res) => {
  try {
    const files = await File.find({}, 'filename contentType size');
    res.json(files);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

app.get('/files/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const file = await File.findOne({ filename });
    if (!file) {
      return res.status(404).send('File not found');
    }
    // Set Content-Disposition header to 'inline' to open file in the browser
    res.setHeader('Content-Disposition', 'inline');
    res.sendFile(file.filePath);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

app.delete('/files/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const file = await File.findOneAndDelete({ filename });
    if (!file) {
      return res.status(404).send('File not found');
    }
    fs.unlinkSync(file.filePath); // Delete file from uploads folder
    console.log('File deleted successfully:', filename);
    res.status(200).send('File deleted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

app.listen(5500, () => {
  console.log('Server is running on port 5500');
});
