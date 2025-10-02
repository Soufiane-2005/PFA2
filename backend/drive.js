const fs = require('fs');
const { google } = require('googleapis');
require('dotenv').config();

const auth = new google.auth.GoogleAuth({
  keyFile: 'apiKey.json', // Ton fichier JSON du compte de service
  scopes: ['https://www.googleapis.com/auth/drive'],
});

const driveService = google.drive({ version: 'v3', auth });

// Ton dossier Drive public partagé (copié depuis Google Drive)
const FOLDER_ID = process.env.FOLDER_ID;

async function uploadFileToDrive(filePath, fileName, mimeType) {
  const fileMetadata = {
    name: fileName,
    parents: [FOLDER_ID], // Ajout au dossier Google Drive spécifique
  };

  const media = {
    mimeType: mimeType,
    body: fs.createReadStream(filePath),
  };

  try {
    // Création du fichier dans Google Drive
    const response = await driveService.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id',
    });

    const fileId = response.data.id;

    // Rendre le fichier public
    await driveService.permissions.create({
      fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    // Retourner le lien public du fichier
    const fileUrl = `https://drive.google.com/file/d/${fileId}/view`;
    return fileUrl;
  } catch (error) {
    console.error('Erreur lors de l’upload vers Google Drive :', error);
    throw error;
  }
}


function extractFileId(url) {
  const regex = /\/d\/([a-zA-Z0-9_-]+)/;
  const match = url.match(regex);
  if (match && match[1]) {
    return match[1];
  }
  return null; // ou gérer erreur
}


async function deleteFileFromDrive(fileUrl) {
  const drive = google.drive({ version: 'v3', auth });
  const fileId = extractFileId(fileUrl)
  await drive.files.delete({ fileId });
}



module.exports = {uploadFileToDrive, deleteFileFromDrive};
