import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white relative overflow-hidden">
      <div className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-r from-teal-100 to-transparent rounded-r-full transform scale-125"></div>

      <div className="relative z-10 text-center p-8">
        <h1 className="text-6xl font-light text-gray-800">404</h1>
        <p className="mt-4 text-lg text-gray-600">
          Die Seite, die Sie suchen, existiert nicht oder wurde verschoben.
        </p>

        <div className="mt-6">
          <Link
            to="/home"
            className="px-6 py-3 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-700 transition-all"
          >
            Zurück zur Startseite
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
