const express = require("express");
const multer = require("multer");
const { google } = require("googleapis");

const app = express();
const port = 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const drive = google.drive({ version: 'v3', auth: 'YOUR_API_KEY' });

app.post("/api/upload", upload.single('file'), (req, res) => {
    const file = req.file;

    const driveFile = {
        requestBody: {
            name: file.originalname,
            mimeType: file.mimetype,
        },
        media: {
            mimeType: file.mimetype,
            body: file.buffer,
        },
    };

    drive.files.create(driveFile, (err, file) => {
        if (err) {
            return res.status(500).send("Error uploading to Google Drive");
        }
        res.json({ fileId: file.data.id });
    });
});

app.get("/api/getImages", (req, res) => {
    drive.files.list({
        q: "'your-folder-id' in parents",
        fields: "files(id, name)",
    }, (err, response) => {
        if (err) {
            return res.status(500).send("Error fetching images");
        }
        res.json({ files: response.data.files });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
