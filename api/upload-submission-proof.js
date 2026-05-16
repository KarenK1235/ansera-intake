import { google } from "googleapis";
import { Readable } from "stream";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "8mb",
    },
  },
};

function dataUrlToBuffer(dataUrl) {
  const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);

  if (!matches || matches.length !== 3) {
    throw new Error("Invalid image data URL");
  }

  return {
    mimeType: matches[1],
    buffer: Buffer.from(matches[2], "base64"),
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { imageDataUrl, fileName } = req.body || {};

    if (!imageDataUrl || !fileName) {
      return res.status(400).json({ error: "Missing imageDataUrl or fileName" });
    }

    const clientEmail = process.env.GOOGLE_DRIVE_CLIENT_EMAIL;
    const privateKey = (process.env.GOOGLE_DRIVE_PRIVATE_KEY || "")
  .replace(/^"|"$/g, "")
  .replace(/\\n/g, "\n")
  .trim();
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    if (!clientEmail || !privateKey || !folderId) {
      return res.status(500).json({ error: "Missing Google Drive environment variables" });
    }

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/drive"],
    });

    const drive = google.drive({ version: "v3", auth });

    const { mimeType, buffer } = dataUrlToBuffer(imageDataUrl);

    const safeFileName = fileName.endsWith(".png") ? fileName : `${fileName}.png`;

    const uploaded = await drive.files.create({
      requestBody: {
        name: safeFileName,
        parents: [folderId],
        mimeType,
      },
      media: {
        mimeType,
        body: Readable.from(buffer),
      },
      fields: "id, name, webViewLink, webContentLink",
    });

    return res.status(200).json({
      success: true,
      fileId: uploaded.data.id,
      fileName: uploaded.data.name,
      webViewLink: uploaded.data.webViewLink,
      webContentLink: uploaded.data.webContentLink,
    });
  } catch (error) {
    console.error("Google Drive upload failed:", error);
    return res.status(500).json({
      error: "Google Drive upload failed",
      details: error.message,
    });
  }
}
