import sharp from "sharp";
import { randomUUIDv7 } from "bun";
import path from "path";
import { profilePath, receiptPath } from "../scripts/dataPath";
import fs from "fs";
import type { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  user?: any;
  fileName?: string;
  smallFileName?: string;
}

const validateFile = (upload: 'receipt' | 'profile') => async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.file) {
    next(); // Wenn keine Datei hochgeladen wurde, fahre mit der Verarbeitung fort
  } else {
    try {
      // Gemeinsame Logik zur Verarbeitung von Bildern
      const mimeType = req.file.mimetype;

      if (mimeType.startsWith("image/")) {
        // Wenn es sich um ein Bild handelt, führe die Logik zur Bildverarbeitung aus
        const metadata = await sharp(req.file.buffer).metadata();

        // Wenn es sich nicht um ein unterstütztes Bildformat handelt, gebe einen Fehler zurück
        if (!metadata.format || !["jpeg", "png", "gif", "webp", "bmp", "tiff", "svg"].includes(metadata.format)) {
          return res.status(400).json({ message: "Es darf nur ein Bild hochgeladen werden!" });
        }

        const MAX_DIMENSION = 2000; // Maximale Größe von 2000×2000
        const SMALL_DIMENSION = 200; // Kleine Größe von 200×200

        // Konvertiere das Bild in das webp-Format
        const webpBuffer = await sharp(req.file.buffer)
          .toFormat('webp')
          .toBuffer();
        const webpMetadata = await sharp(webpBuffer).metadata();
        let buffer = webpBuffer;

        // Wenn die Bildgröße die maximale Grenze überschreitet, skalieren
        if (webpMetadata.width! > MAX_DIMENSION || webpMetadata.height! > MAX_DIMENSION) {
          const scaleFactor = Math.min(MAX_DIMENSION / webpMetadata.width!, MAX_DIMENSION / webpMetadata.height!);
          const newWidth = Math.floor(webpMetadata.width! * scaleFactor);
          const newHeight = Math.floor(webpMetadata.height! * scaleFactor);
          buffer = await sharp(webpBuffer)
            .resize(newWidth, newHeight)
            .toBuffer();
        }

        const newFileName = `${randomUUIDv7()}.webp`;
        const smallFileName = `${newFileName.split('.')[0]}_ss.webp`;

        // Je nach Wert von 'upload' den Speicherort festlegen
        let filePath: string;
        let smallFilePath: string;

        if (upload === 'profile') {
          filePath = path.join(profilePath, newFileName);
          smallFilePath = path.join(profilePath, smallFileName);
        } else {  // Für receipt
          filePath = path.join(receiptPath, newFileName);
          smallFilePath = '';  // Receipt benötigt kein kleines Bild
        }

        // Speichere die große webp-Datei
        await sharp(buffer).toFile(filePath);

        if (upload === 'profile') {
          // Wenn es sich um ein Profilbild handelt, speichere das kleine Bild
          const smallBuffer = await sharp(buffer)
            .resize(SMALL_DIMENSION, SMALL_DIMENSION)
            .toBuffer();
          await sharp(smallBuffer).toFile(smallFilePath);
          req.smallFileName = smallFileName;
        }

        req.fileName = newFileName;

        next();
      } else if (mimeType === "application/pdf" && upload === 'receipt') {
        // Verarbeite PDF-Dateien (nur für receipt-Uploads)
        const pdfFileName = `${randomUUIDv7()}.pdf`;
        const pdfFilePath = path.join(receiptPath, pdfFileName);

        // Speichere die PDF-Datei direkt
        fs.writeFileSync(pdfFilePath, req.file.buffer);
        req.fileName = pdfFileName;
        next();
      } else {
        // Wenn es sich nicht um ein unterstütztes Dateiformat handelt, gebe einen Fehler zurück
        return res.status(400).json({ message: "Unzulässiger Dateityp. Es darf nur Bild oder PDF hochgeladen werden!" });
      }
    } catch (error) {
      console.error("Fehler bei der Dateivalidierung:", error);
      return res.status(400).json({ message: "Ungültiges Datei!" });
    }
  }
};

export default validateFile;