import { mkdirSync, existsSync } from "node:fs";
import { randomUUIDv7 } from "bun";
import type { Request, ParamsDictionary } from "express-serve-static-core";  
import type { ParsedQs } from "qs"; 
import multer from "multer";
import type { FileFilterCallback } from "multer";
import { dataPath, profilePath, receiptPath, foodPicPath } from "./dataPath";

console.log(dataPath);

export function multerInit() {
  if (!existsSync(profilePath)) {
    console.log(
      "Upload-Ordner für Profile-Pics existiert nicht. Wird erstellt..."
    );
    mkdirSync(profilePath);
  }
  if (!existsSync(receiptPath)) {
    console.log(
      "Upload-Ordner für Rechnungen existiert nicht. Wird erstellt..."
    );
    mkdirSync(receiptPath);
  }
  if (!existsSync(foodPicPath)) {
    console.log(
      "Upload-Ordner für Lebensmittelbilder existiert nicht. Wird erstellt..."
    );
    mkdirSync(receiptPath);
  }
}

const imageMimeTypes = [
  "image/jpeg", "image/png", "image/gif", "image/webp", "image/bmp", "image/tiff", "image/svg"
];

const pdfMimeTypes = [
  "application/pdf"
];

// Datei-Filter für ProfilePic-Uploads (nur Bilder zulassen)
const imageFileFilter = (
  req: any, // Den Typ von req auf any ändern
  file: Express.Multer.File, 
  callback: FileFilterCallback
): void => {
  const request = req as Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>; // Den Typ von req erzwingen
  
  if (imageMimeTypes.includes(file.mimetype)) {
    callback(null, true); 
  } else {
    const error = new Error("Es dürfen ausschließlich Bilddateien hochgeladen werden!") as any;
    error.code = "INVALID_FILE_TYPE"; 
    callback(error, false); 
  }
};

// Datei-Filter für Receipt-Uploads (Bilder und PDF-Dateien zulassen)
const receiptFileFilter = (
  req: any, 
  file: Express.Multer.File, 
  callback: FileFilterCallback
): void => {
  if (imageMimeTypes.includes(file.mimetype) || pdfMimeTypes.includes(file.mimetype)) {
    callback(null, true); // Bild- oder PDF-Datei wird erlaubt
  } else {
    const error = new Error("Es dürfen ausschließlich Bilddateien oder PDF-Dateien hochgeladen werden!") as any;
    error.code = "INVALID_FILE_TYPE"; 
    console.error(error.message)
    callback(error, false); // Andere Dateitypen werden abgelehnt
  }
};

export const profilePicUpload = multer({ 
  storage: multer.memoryStorage(),
  fileFilter: imageFileFilter // Verwende profilePicFileFilter, um nur Bilddateien zuzulassen
});

export const receiptUpload = multer({ 
  storage: multer.memoryStorage(),
  fileFilter: receiptFileFilter  // Verwende receiptFileFilter, um Bild- und PDF-Dateien zuzulassen
});
const foodPicStorage = multer.diskStorage({
  destination: foodPicPath,
  filename: function (req, file, callback) {
    const suffix = file.originalname.split(".").at(-1);
    const filename = randomUUIDv7() + "." + suffix;
    callback(null, filename);
  },
});
export const foodPicUpload = multer({ storage: foodPicStorage });
