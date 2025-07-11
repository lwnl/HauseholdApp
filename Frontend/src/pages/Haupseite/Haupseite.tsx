import { useNavigate } from "react-router-dom";
import { ShoppingCart, BarChart, ListAlt, Warning } from "@mui/icons-material";
import TeamSection from "./TeamMembers";

const Hauptseite = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-100 to-blue-100 text-gray-900">
      {/* Header */}
      <header className="w-full p-5 bg-white shadow-md flex justify-between items-center fixed top-0 left-0 z-10">
        <span className="text-2xl font-bold text-green-600">🛒 ALMS test</span>
      </header>

      {/* Main Content */}
      <div className="flex-grow">
        {/* Hero-Bereich */}
        <div className="container mx-auto px-6 pt-28 pb-12 flex flex-col lg:flex-row items-center gap-12 max-w-6xl">
          {/* Text-Bereich */}
          <div className="lg:w-1/2 text-center lg:text-left space-y-6">
            <h1 className="text-4xl font-semibold text-gray-700 leading-relaxed tracking-wide">
              Die smarte Lösung für deinen Haushalt 🏡
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
              Verwalte Einkäufe, überwache Lebensmittel, tracke Haushaltskosten
              und teile alles mit deiner Familie – einfach, effizient und immer
              aktuell!
            </p>
            <p className="text-md text-gray-600 mt-2 max-w-lg">
              Teste es kostenlos und organisiere dein Leben noch einfacher.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="mt-4 px-8 py-4 bg-green-500 text-white font-medium rounded-xl shadow-xl hover:bg-green-600 transition-all transform hover:scale-105 hover:shadow-2xl"
            >
              Kostenlos starten
            </button>
          </div>

          {/* Bild */}
          <div className="lg:w-1/2 flex justify-center">
            <img
              src="/images/einkaufsliste.avif"
              alt="Einkaufsliste"
              className="w-full max-w-lg drop-shadow-lg rounded-xl"
            />
          </div>
        </div>

        {/* Feature-Bereich */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mt-12 px-6">
          {/* Einkaufsliste */}
          <div className="p-8 bg-white shadow-lg rounded-xl flex flex-col items-center text-center transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:bg-green-50">
            <ListAlt className="text-green-600" fontSize="large" />
            <h3 className="text-xl font-bold text-green-600 mt-3">
              Einkaufsliste
            </h3>
            <p className="text-gray-600 text-sm mt-2">
              Erstelle & teile Einkaufslisten – immer synchron & überall
              verfügbar.
            </p>
          </div>

          {/* Haushaltsbuch */}
          <div className="p-8 bg-white shadow-lg rounded-xl flex flex-col items-center text-center transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:bg-blue-50">
            <BarChart className="text-blue-600" fontSize="large" />
            <h3 className="text-xl font-bold text-blue-600 mt-3">
              Haushaltsbuch
            </h3>
            <p className="text-gray-600 text-sm mt-2">
              Behalte den Überblick über Einnahmen & Ausgaben – plane dein
              Budget clever!
            </p>
          </div>

          {/* Lebensmittelverwaltung */}
          <div className="p-8 bg-white shadow-lg rounded-xl flex flex-col items-center text-center transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:bg-yellow-50">
            <ShoppingCart className="text-yellow-600" fontSize="large" />
            <h3 className="text-xl font-bold text-yellow-600 mt-3">
              Lebensmittelverwaltung
            </h3>
            <p className="text-gray-600 text-sm mt-2">
              Behalte den Überblick über deine Vorräte & Mindesthaltbarkeiten.
            </p>
          </div>

          {/* Notiz Warnung */}
          <div className="p-8 bg-white shadow-lg rounded-xl flex flex-col items-center text-center transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:bg-red-50">
            <Warning className="text-red-600" fontSize="large" />
            <h3 className="text-xl font-bold text-red-600 mt-3">
              Notiz Warnung
            </h3>
            <p className="text-gray-600 text-sm mt-2">
              Verwalte und überwache wichtige Notizen und Warnungen.
            </p>
          </div>
        </div>
        <TeamSection />
      </div>

      {/* Footer */}
      <footer className="w-full p-5 bg-white shadow-md flex justify-between items-center text-center mt-6">
        <p className="text-m">
          © {new Date().getFullYear()} HaushaltsApp – Alle Rechte vorbehalten.
        </p>
      </footer>
    </div>
  );
};

export default Hauptseite;
