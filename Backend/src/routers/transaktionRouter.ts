import { Transaktion } from "./../models/Transaktion";
import express from "express";
import { cookieTokenAuth } from "../middleware/cookieTokenAuth";
import { receiptUpload } from "../scripts/multerInit";
import { rm } from "node:fs/promises";
import path from "node:path";
import validateFile, { type AuthRequest } from "../middleware/validateFile";
import { receiptPath } from "../scripts/dataPath";
import { kontostand } from "../scripts/kontostand";
import fs from "fs";
import { amount2Integer } from "../scripts/amount2Integer";

const transaktionRouter = express.Router();

const optionTypes = ["both", "income", "expense"] as const;
type OptionType = (typeof optionTypes)[number];
//get account balance
transaktionRouter.get(
  "/kontostand",
  cookieTokenAuth,
  async (req: AuthRequest, res) => {
    const id = req.user.userId;
    const { option = "both" } = req.query;
    //@ts-ignore option is of type OptionType but could be querystring.parsedqs
    if (!optionTypes.includes(option)) {
      res.status(400).json({ errorMessage: "Invalid option!" });
      return;
    }
    try {
      const kontostandValue: number | null = await kontostand(
        id,
        option as OptionType
      );

      if (kontostandValue === null) {
        return res.status(500).json({
          message: "Fehler beim Abrufen des Kontostands.",
        });
      }

      res.status(200).json({ kontostand: kontostandValue });
    } catch (error) {
      console.error("Fehler beim Abrufen des Kontostands:", error);
      res.status(500).json({
        message: "Fehler beim Abrufen des Kontostands",
      });
    }
  }
);

// get all transaktion from the loggedin user
transaktionRouter.get("/", cookieTokenAuth, async (req: AuthRequest, res) => {
  const { userId } = req.user;
  const filterCriteria: any = { userId };
  try {
    const transactions = await Transaktion.find(filterCriteria);
    if (transactions.length === 0) {
      return res.json({
        message: "Keine Transaktion gefunden!",
      });
    }
    res.status(200).json({
      transactions,
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error("Fehler beim Abrufen der Transaktionen", errorMessage);
    res.status(500).json({
      message: errorMessage,
    });
  }
});
//Rechnungsdatei abrufen
transaktionRouter.get("/receipt/:_id", cookieTokenAuth, async (req, res) => {
  try {
    const { _id } = req.params;
    const transaction = await Transaktion.findOne({ _id });
    if (!transaction) {
      return res.status(404).json({
        message: "Keine Transaktion gefunden!",
      });
    }

    const fileName = transaction.image;
    if (!fileName) {
      return res.status(404).json({
        message: "Keine Rechnung gefunden!",
      });
    }

    if (fileName.endsWith("pdf")) {
      res.setHeader("Content-Type", "application/pdf");
    }

    const filePath = path.join(receiptPath, fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Datei nicht gefunden!" });
    }

    res.sendFile(filePath, (err) => {
      if (err) {
        console.error("Fehler beim Senden der Datei", err);
      }
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error("Fehler beim Abrufen der Rechnung", errorMessage);
    res.status(500).json({
      message: errorMessage,
    });
  }
});

//sortiert nach Option1 mit 'Alles', 'Einnahmen', 'Ausgaben' und Option2 mit 'Datum', 'Beschreibung', 'Kategorie' und 'Betrag' und 'Richtung'
transaktionRouter.get(
  "/:option1/:option2?/:direction?",
  cookieTokenAuth,
  async (req: AuthRequest, res) => {
    const { option1, option2 = "date", direction = "true" } = req.params;
    const { userId } = req.user;

    // Überprüfen, ob die angegebene Sortieroption gültig ist
    if (!["all", "income", "expense"].includes(option1)) {
      return res.status(400).json({
        message: "Ungültige Sortieroption!",
      });
    }

    let filterCriteria: { userId: String; type?: String } = { userId }; // Standardmäßig nach userId filtern
    let sortCriteria: { [key: string]: 1 | -1 } = {};

    //Setze die Filterbedingungen gemäß Option1
    switch (option1) {
      case "income":
        filterCriteria.type = "income";
        break;
      case "expense":
        filterCriteria.type = "expense";
        break;
      case "all":
        break;
      default:
        break;
    }

    //Setze die Sortierbedingung gemäß Option2
    const directionBoolean = direction === "true"; // Richtung in einen Booleschen Wert umwandeln
    switch (option2) {
      case "date":
        sortCriteria.date = directionBoolean ? 1 : -1;
        break;
      case "amount":
        sortCriteria.amount = directionBoolean ? 1 : -1;
        break;
      case "description":
        sortCriteria.description = directionBoolean ? 1 : -1;
        break;
      case "category":
        sortCriteria.category = directionBoolean ? 1 : -1;
        break;
      case "image":
        sortCriteria.image = directionBoolean ? 1 : -1;
        break;
      default:
        break;
    }

    try {
      const transactions = await Transaktion.find(filterCriteria).sort(
        sortCriteria
      );

      if (transactions.length === 0) {
        return res.json({
          message: "Keine entsprechende Transaktion gefunden",
          transactions,
        });
      }

      return res.status(200).json({
        message: "Erhalten Sie die Transaktion erfolgreich",
        transactions,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Fehler beim Abrufen der Daten",
        error: (error as Error).message,
      });
    }
  }
);

// Neue Transaktion anlegen
transaktionRouter.post(
  "/",
  cookieTokenAuth,
  // @ts-ignore
  receiptUpload.single("image"),
  validateFile("receipt"),
  async (req: AuthRequest, res) => {
    try {
      const { userId } = req.user;
      const { date, amount, description, category, type } = req.body;
      // Überprüfen, ob alle erforderlichen Felder ausgefüllt sind
      if (!date || !amount || !description || !type) {
        if (req.fileName) {
          await rm(path.join(receiptPath, req.fileName));
        }
        return res.status(400).json({
          message: "Unvollständige Daten!",
        });
      }
      // Validierung und Bearbeitung des Betrags
      const trimmedAmount = amount.trim(); // Entfernen von Leerzeichen am Anfang und Ende
      const validAmount = /^[\d,\.]+$/; // Überprüfen, ob nur Zahlen, Kommas oder Punkte enthalten sind
      if (!validAmount.test(trimmedAmount) || trimmedAmount.includes(" ")) {
        if (req.fileName) {
          await rm(path.join(receiptPath, req.fileName));
        }
        return res.status(400).json({
          message: "Betrag ist ungültig!",
        });
      }
      // Ersetzen des Kommas durch einen Punkt
      const normalizedAmount = trimmedAmount.replace(",", ".");
      // Betrag in eine Ganzzahl umwandeln
      let integerAmount = amount2Integer(normalizedAmount); // parseFloat(normalizedAmount.replace('.', '')) || 0;
      // Wenn die Umwandlung fehlschlägt, eine Fehlermeldung zurückgeben
      if (isNaN(integerAmount as number)) {
        if (req.fileName) {
          await rm(path.join(receiptPath, req.fileName));
        }
        return res.status(400).json({
          message: "Betrag ist ungültig!",
        });
      }
      const transaktionData: Record<string, any> = {
        date: new Date(date),
        amount: integerAmount,
        description,
        category,
        type,
        userId,
      };
      if (req.fileName) {
        transaktionData.image = req.fileName;
      }
      // Neue Transaktion erstellen
      const newTransaktion = await Transaktion.create(transaktionData);
      return res.status(201).json({
        message: "Transaktion erfolgreich hinzugefügt",
        transaktion: newTransaktion,
      });
    } catch (error) {
      // Wenn ein Fehler auftritt, das temporär hochgeladene Bild löschen
      if (req.fileName) {
        await rm(path.join(receiptPath, req.fileName));
      }
      const errorMessage = (error as Error).message;
      console.error("Fehler beim Hinzufügen der Transaktion", errorMessage);
      res.status(500).json({
        message: errorMessage,
      });
    }
  }
);
// delete a transaction
transaktionRouter.delete(
  "/delete/:_id",
  cookieTokenAuth,
  async (req: AuthRequest, res) => {
    const { _id } = req.params;
    try {
      await Transaktion.findByIdAndDelete({ _id });
      return res.status(200).json({
        message: "Transaktion erfolgreich gelöscht",
      });
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error("Fehler beim Löschen der Transaktion", errorMessage);
      res.status(500).json({
        message: errorMessage,
      });
    }
  }
);

//change a transaction
// @ts-ignore
transaktionRouter.patch(
  "/alter/:_id",
  cookieTokenAuth,
  // @ts-ignore
  receiptUpload.single("image"),
  validateFile("receipt"),
  async (req: AuthRequest, res) => {
    const { date, amount, description, category, type } = req.body;
    const { _id } = req.params;
    if (
      !date &&
      !amount &&
      !description &&
      !category &&
      !type &&
      !req.fileName
    ) {
      return res.status(400).json({
        message: "Fehlende Daten",
      });
    }
    const updateData: any = {};

    let integerAmount = amount2Integer(amount); // parseFloat(normalizedAmount.replace('.', '')) || 0;
    if (amount) {
      // Wenn die Umwandlung fehlschlägt, eine Fehlermeldung zurückgeben
      if (isNaN(integerAmount as number)) {
        if (req.fileName) {
          await rm(path.join(receiptPath, req.fileName));
        }
        return res.status(400).json({
          message: "Betrag ist ungültig!",
        });
      }
    }

    if (date !== undefined) {
      updateData.date = new Date(date);
    }

    if (req.fileName) {
      updateData.image = req.fileName;
    }

    const fields: any = { amount: integerAmount, description, category, type };

    for (const key in fields) {
      if (fields[key] !== undefined) {
        updateData[key] = fields[key];
      }
    }

    try {
      const updatedTransaction = await Transaktion.findByIdAndUpdate(
        _id,
        updateData,
        { new: true }
      );

      if (!updatedTransaction) {
        return res.status(404).json({
          message: "Transaktion nicht gefunden",
        });
      }

      return res.status(200).json({
        message: "Transaktion erfolgreich aktualisiert",
        updatedTransaction,
      });
    } catch (error) {
      if (req.fileName) {
        await rm(path.join(receiptPath, req.fileName));
      }
      console.error("Fehler bei der Aktualisierung:", error);
      return res.status(500).json({
        message: "Fehler bei der Aktualisierung der Transaktion",
      });
    }
  }
);

export default transaktionRouter;
