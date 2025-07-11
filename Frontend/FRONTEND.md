# HaushaltsApp - Deine smarte Haushaltsverwaltung

## Übersicht

HaushaltsApp ist eine moderne Webanwendung zur Verwaltung von Einkäufen, Haushaltsausgaben und Vorräten. Die App bietet eine benutzerfreundliche und intuitive Oberfläche, um Haushaltsaufgaben effizienter zu organisieren. Sie ermöglicht Benutzern, Einkaufslisten zu erstellen, Haushaltskosten zu verfolgen und gemeinsam mit Familienmitgliedern zu verwalten.

---

## 📸 Screenshots

_Füge hier einige Screenshots deiner Anwendung ein._

---

## Merkmale

### Benutzerverwaltung

- **Registrierung & Login:** Sichere Authentifizierung mit JWT.
- **Profilverwaltung:** Benutzer können ihre Profildaten bearbeiten.
- **Mehrere Benutzer:** Familienmitglieder können sich registrieren und die App gemeinsam nutzen.

### Einkaufsliste

- **Erstellen & Teilen:** Einkaufslisten können erstellt und mit anderen Benutzern geteilt werden.
- **Mobil verfügbar:** Zugriff auf die Einkaufsliste von überall.
- **Automatische Listen:** Erstellung von Einkaufsempfehlungen basierend auf Vorratsmengen.

### Lebensmittelverwaltung

- **Vorräte verfolgen:** Lebensmittel und Mindesthaltbarkeitsdaten im Blick behalten.
- **Warnungen:** Benachrichtigung, wenn ein Lebensmittel bald abläuft.
- **Suchfunktion:** Schnell ein bestimmtes Lebensmittel finden.

### Haushaltsbuch

- **Einnahmen & Ausgaben:** Erfassen und verwalten aller finanziellen Bewegungen.
- **Budgetplanung:** Anzeige des aktuellen Haushaltsbudgets.
- **Rechnungen hochladen:** Speicherung von Quittungen als Bilder.

### Haushaltspinwand ("Kühlschrankmagnet")

- **Mitteilungen & Erinnerungen:** Benutzer können Nachrichten und Notizen an eine digitale Haushalts-Pinnwand anheften.
- **Systemwarnungen:** Automatische Hinweise zu verderblichen Lebensmitteln und Budgetwarnungen.

---

## Technologien

### **Frontend**

- **React** - UI-Bibliothek
- **TypeScript** - Typensicherheit
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Axios** - Datenfetching
- **TanStack Query** - Datenfetching & State-Management

### **Backend**

- **Bun** - Laufzeitumgebung
- **Express.js** - Serverseitiges Framework
- **MongoDB** - NoSQL-Datenbank
- **Mongoose** - ODM für MongoDB
- **JWT** - Token-basierte Authentifizierung

### **Weitere Technologien & Tools**

- **i18next** - Mehrsprachigkeit
- **Postman** - API-Testing
- **Git & GitHub** - Versionskontrolle
- **Netlify** - Deployment

---

## Projektstruktur

```
HaushaltsApp/
│── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── index.ts
│── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api/
│   │   ├── App.tsx
│   │   ├── main.tsx
│── .gitignore
│── package.json
│── README.md
```

---

## Installation & Setup

### Backend starten

```sh
cd backend
npm install
npm run dev
```

### Frontend starten

```sh
cd frontend
npm install
npm run dev
```

### Umgebungskonfiguration (.env)

Erstelle eine `.env`-Datei im Backend:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

---

## Team

- **Alper** - [GitHub](https://github.com/Alpi2) | [LinkedIn](#)
- **Liang** - [GitHub](https://github.com/lwnl) | [LinkedIn](#)
- **Murat** - [GitHub](https://github.com/Muratzenkin) | [LinkedIn](https://www.linkedin.com/in/murat-zenkin-2a04b32a5/)
- **Sebastian** - [GitHub](https://github.com/SebastianKues) | [LinkedIn](#)

---

## Zukünftige Verbesserungen

- PWA-Unterstützung für Offline-Nutzung
- Push-Benachrichtigungen
- Erweiterte Finanzstatistiken

**Viel Spaß mit HaushaltsApp!**
