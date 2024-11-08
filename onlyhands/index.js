const express = require('express');
const multer = require('multer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const fs = require('fs');
const path = require('path');

// Express szerver beállítása
const app = express();
const port = 3000;

// Multer beállítása a fájlok kezelésére
const upload = multer({ dest: 'uploads/' }); // A fájlok ide kerülnek először

// Google API hitelesítés
const oauth2Client = new OAuth2(
  '1oKnIrWkr3ACP3Wv709gl6hE6ZjBlms3I', // A te Client ID-d
  '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', // A te Client Secret-ed
  '1023319210082-jhf7pubcbkg3kmmmh5otoioatpblk18i.apps.googleusercontent.com
' // A te redirect URI-d
);

// Fájl feltöltése a Google Drive-ra
app.post('/upload', upload.single('file'), async (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.file.filename);

  try {
    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    // Fájl metadata
    const fileMetadata = {
      name: req.file.originalname, // Fájl neve
      parents: ['YOUR_FOLDER_ID'], // A Google Drive mappa, ahova feltöltjük
    };

    // Fájl média
    const media = {
      mimeType: req.file.mimetype,
      body: fs.createReadStream(filePath),
    };

    // Fájl feltöltése
    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
    });

    // Válasz
    res.status(200).json({ message: 'Fájl sikeresen feltöltve', fileId: file.data.id });
  } catch (error) {
    res.status(500).json({ message: 'Hiba történt a fájl feltöltésekor', error: error.message });
  }
});

// Szerver indítása
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
