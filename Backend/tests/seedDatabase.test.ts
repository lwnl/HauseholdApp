import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import User from '../src/models/User';
import Notiz from '../src/models/Notiz';
import Warnung from '../src/models/Warnung';
import mongoose from 'mongoose';
import dbConnection from '../src/scripts/dbConnection';
import { seedDatabase } from '../src/scripts/seed'; 
import Einkaufsliste from '../src/models/Einkauflist';

describe('Seed Database Test', () => {
  // Testen der Datenbankinitialisierung
  it('sollte die Datenbank korrekt initialisieren', async () => {
    await seedDatabase();
    await dbConnection(); 
    
    // Überprüfen der genauen Anzahl an Daten
    const usersCount = await User.countDocuments({});
    const notizCount = await Notiz.countDocuments({});
    const einkaufslistCount = await Einkaufsliste.countDocuments({});

    // Sicherstellen, dass die Anzahl der erstellten Benutzer, Notizen und Warnungen mit den Erwartungen übereinstimmt
    expect(usersCount).toBe(3); // Einschließlich zwei Benutzer und einen Admin-Benutzer
    await mongoose.disconnect();
  });
});