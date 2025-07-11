import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User";
import Notiz from "../models/Notiz";
import Warnung from "../models/Warnung";
import LebensmittelTyp from "../models/LebensmittelTyp";
import dbConnection from "./dbConnection";
import dotenv from "dotenv";
import { Transaktion } from "../models/Transaktion";
import Einkaufsliste from "../models/Einkauflist";
import Lebensmittel from "../models/Lebensmittel";

dotenv.config();

export const seedDatabase = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log("⏳ Datenbank nicht verbunden. Starte Verbindung...");
      await dbConnection();
    } else {
      console.log("✅ Datenbank bereits verbunden.");
    }

    // 🗑️ Löschen aller vorhandenen Daten
    await Warnung.deleteMany({});
    await User.deleteMany({});
    await Notiz.deleteMany({});
    await Einkaufsliste.deleteMany({});
    await LebensmittelTyp.deleteMany({});
    await Lebensmittel.deleteMany({});
    await Transaktion.deleteMany({});
    console.log("✅ Datenbank wurde geleert");

    // 🔑 Standardpasswort definieren und hashen
    const defaultPassword = process.env.BCRYPT_PASSWORT as string;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);

    // 👤 Erstellen von Benutzern
    const user1 = new User({
      userName: "MaxMuster",
      email: "max@example.com",
      password: hashedPassword,
      profilePicture: "00000000-0000-0000-0000-000000000000.avif",
      profilePicture_ss: "00000000-0000-0000-0000-000000000000_ss.avif",
      notiz: [],
      einkaufslist: [],
    });

    const user2 = new User({
      userName: "LisaBeispiel",
      email: "lisa@example.com",
      profilePicture: "00000000-0000-0000-0000-000000000000.avif",
      profilePicture_ss: "00000000-0000-0000-0000-000000000000_ss.avif",
      password: hashedPassword,
      notiz: [],
      einkaufslist: [],
    });

    const adminUser = new User({
      userName: "admin",
      email: "admin@example.com",
      password: await bcrypt.hash("admin", saltRounds),
      profilePicture: "00000000-0000-0000-0000-000000000000.avif",
      role: "admin",
      notiz: [],
      einkaufslist: [],
    });

    await user1.save();
    await user2.save();
    await adminUser.save();
    console.log("✅ 3 Users erstellt");

    // Lebensmittel-Typen erstellen
    await LebensmittelTyp.create([
      // Obst
      { name: "Apfel", category: "obst", einheit: "kg", quelle: "system" },
      { name: "Birne", category: "obst", einheit: "kg", quelle: "system" },
      { name: "Traube", category: "obst", einheit: "kg", quelle: "system" },
      { name: "Banane", category: "obst", einheit: "kg", quelle: "system" },
      { name: "Kiwi", category: "obst", einheit: "stk", quelle: "system" },
      { name: "Mango", category: "obst", einheit: "stk", quelle: "system" },
      { name: "Orange", category: "obst", einheit: "stk", quelle: "system" },
      { name: "Ananas", category: "obst", einheit: "stk", quelle: "system" },
    
      // Fleisch
      { name: "Rindfleisch", category: "fleisch", einheit: "kg", quelle: "system" },
      { name: "Schweinefleisch", category: "fleisch", einheit: "kg", quelle: "system" },
      { name: "Hackfleisch", category: "fleisch", einheit: "kg", quelle: "system" },
      { name: "Hähnchenschenkel", category: "fleisch", einheit: "kg", quelle: "system" },
      { name: "Putenbrust", category: "fleisch", einheit: "kg", menge: 1, quelle: "system" },
    
      // Getränk
      { name: "Wasser", category: "getränk", einheit: "liter", quelle: "system" },
      { name: "Orangensaft", category: "getränk", einheit: "liter", quelle: "system" },
      { name: "Cola", category: "getränk", einheit: "liter", quelle: "system" },
      { name: "Eistee", category: "getränk", einheit: "liter", quelle: "system" },
      { name: "Apfelsaft", category: "getränk", einheit: "liter", quelle: "system" },
      { name: "Limonade", category: "getränk", einheit: "liter", quelle: "system" },
    
      // Gemüse（蔬菜）
      { name: "Karotte", category: "gemüse", einheit: "kg", quelle: "system" },
      { name: "Brokkoli", category: "gemüse", einheit: "kg", quelle: "system" },
      { name: "Zucchini", category: "gemüse", einheit: "kg", quelle: "system" },
      { name: "Paprika", category: "gemüse", einheit: "kg", quelle: "system" },
      { name: "Spinat", category: "gemüse", einheit: "kg", quelle: "system" },
    
      // Milchprodukt（乳制品）
      { name: "Milch", category: "milchprodukt", einheit: "liter", quelle: "system" },
      { name: "Käse", category: "milchprodukt", einheit: "kg", quelle: "system" },
      { name: "Joghurt", category: "milchprodukt", einheit: "stk", quelle: "system" },
      { name: "Butter", category: "milchprodukt", einheit: "kg", quelle: "system" },
      { name: "Sahne", category: "milchprodukt", einheit: "liter", quelle: "system" },
    
      // Teigwaren（面食）
      { name: "Spaghetti", category: "teigwaren", einheit: "kg", quelle: "system" },
      { name: "Penne", category: "teigwaren", einheit: "kg", quelle: "system" },
      { name: "Lasagneblätter", category: "teigwaren", einheit: "kg", quelle: "system" },
      { name: "Gnocchi", category: "teigwaren", einheit: "kg", quelle: "system" },
      { name: "Tortellini", category: "teigwaren", einheit: "kg", quelle: "system" },
    
      // Brot（面包）
      { name: "Vollkornbrot", category: "brot", einheit: "stk", quelle: "system" },
      { name: "Baguette", category: "brot", einheit: "stk", quelle: "system" },
      { name: "Brötchen", category: "brot", einheit: "stk", quelle: "system" },
      { name: "Toastbrot", category: "brot", einheit: "stk", quelle: "system" },
      { name: "Ciabatta", category: "brot", einheit: "stk", quelle: "system" },
    
      // Tiefkühl（冷冻）
      { name: "Tiefkühlpizza", category: "tiefkühl", einheit: "stk", quelle: "system" },
      { name: "Eiscreme", category: "tiefkühl", einheit: "liter", quelle: "system" },
      { name: "TK-Gemüse", category: "tiefkühl", einheit: "kg", quelle: "system" },
      { name: "Pommes", category: "tiefkühl", einheit: "kg", quelle: "system" },
      { name: "Fischstäbchen", category: "tiefkühl", einheit: "stk", quelle: "system" },
    ]);

    console.log("✅ Lebensmittel-Typen wurden erstellt");
    console.log("✅ Datenbank erfolgreich initialisiert");
  } catch (error) {
    console.error("❌ Fehler bei der Initialisierung der Datenbank:", error);
  } finally {
    // 🔌 Datenbankverbindung trennen
    await mongoose.disconnect();
    console.log("🔌 Datenbankverbindung getrennt");
  }
};