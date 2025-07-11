import { useState, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import HOST from "../../context/HostContext";
import useDarkMode from "../../context/useDarkMode";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Calendar,
  FileText,
  Save,
  Image,
  X,
} from "lucide-react";
import { useKassenbuch } from "../../context/KassenbuchContext";


export default function Neu() {
  const { darkMode } = useDarkMode();
  const [date, setDate] = useState<Date | null>(new Date());
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<string>("");
  const [type, setType] = useState("expense");
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const { reloadData } = useKassenbuch();


  const fileInputRef = useRef<HTMLInputElement>(null);
  const host = HOST;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // Create preview URL for image files
      if (selectedFile.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreview(e.target?.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        // For non-image files (like PDFs), use a placeholder
        setFilePreview("pdf");
      }
    }
  };

  const clearFile = () => {
    setFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append("date", date ? date.toISOString() : "");
    formData.append("description", description);
    formData.append("amount", amount);
    formData.append("category", category);
    formData.append("type", type);
    if (file) {
      formData.append("image", file);
    }

    try {
      const response = await axios.post(`${host}/transaction`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      console.log("Transaction added:", response.data);
      setSuccess(true);
      setDescription("");
      setAmount("");
      setCategory("");
      setType("expense");
      setFile(null);
      setFilePreview(null);
      reloadData()
    } catch (error) {
      console.error("Error adding transaction:", error);
      setError(
        "Fehler beim Hinzufügen der Transaktion. Bitte versuchen Sie es erneut."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2
        className={`text-xl font-bold mb-6 ${
          darkMode ? "text-white" : "text-gray-800"
        }`}
      >
        Neue Transaktion
      </h2>

      {success && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          Transaktion erfolgreich hinzugefügt!
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setType("income")}
            className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 ${
              type === "income"
                ? "bg-green-100 text-green-700 border-2 border-green-500"
                : `${
                    darkMode
                      ? "bg-gray-700 text-gray-300"
                      : "bg-gray-100 text-gray-700"
                  } border-2 border-transparent`
            }`}
          >
            <ArrowUpCircle size={20} />
            <span>Einnahme</span>
          </button>

          <button
            type="button"
            onClick={() => setType("expense")}
            className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 ${
              type === "expense"
                ? "bg-red-100 text-red-700 border-2 border-red-500"
                : `${
                    darkMode
                      ? "bg-gray-700 text-gray-300"
                      : "bg-gray-100 text-gray-700"
                  } border-2 border-transparent`
            }`}
          >
            <ArrowDownCircle size={20} />
            <span>Ausgabe</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Datum
            </label>
            <div className={`relative rounded-md shadow-sm`}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar
                  size={18}
                  className={darkMode ? "text-gray-400" : "text-gray-500"}
                />
              </div>
              <DatePicker
                selected={date}
                onChange={(date: Date | null) => setDate(date)}
                className={`pl-10 block w-full rounded-md border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                dateFormat="dd.MM.yyyy"
              />
            </div>
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Betrag (€)
            </label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              className={`block w-full rounded-md border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
        </div>

        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Beschreibung
          </label>
          <div className="relative">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Beschreibung der Transaktion"
              className={`block w-full rounded-md border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              } px-3 py-2 ${
                filePreview ? "pr-12" : ""
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />

            {filePreview && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <button
                  type="button"
                  onClick={() => setShowPreviewModal(true)}
                  className={`h-8 w-8 rounded-md flex items-center justify-center ${
                    darkMode
                      ? "bg-gray-600 hover:bg-gray-500"
                      : "bg-gray-200 hover:bg-gray-300"
                  } transition-colors`}
                >
                  {filePreview === "pdf" ? (
                    <FileText
                      size={16}
                      className={darkMode ? "text-gray-200" : "text-gray-700"}
                    />
                  ) : (
                    <Image
                      size={16}
                      className={darkMode ? "text-gray-200" : "text-gray-700"}
                    />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Kategorie (optional)
          </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="z.B. Lebensmittel, Miete, Gehalt"
            className={`block w-full rounded-md border ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
            } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>

        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Beleg hochladen (optional)
          </label>
          <div className={`relative rounded-md shadow-sm`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FileText
                size={18}
                className={darkMode ? "text-gray-400" : "text-gray-500"}
              />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className={`pl-10 block w-full rounded-md border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {filePreview && (
              <button
                type="button"
                onClick={clearFile}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                title="Beleg entfernen"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <p
            className={`mt-1 text-xs ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Unterstützte Formate: Bilder (JPG, PNG) und PDF-Dokumente
          </p>

          {filePreview && filePreview !== "pdf" && (
            <div className="mt-2 flex items-center space-x-2">
              <div
                className={`w-16 h-16 rounded-md overflow-hidden border ${
                  darkMode ? "border-gray-600" : "border-gray-300"
                } cursor-pointer`}
                onClick={() => setShowPreviewModal(true)}
              >
                <img
                  src={filePreview}
                  alt="Vorschau"
                  className="w-full h-full object-cover"
                />
              </div>
              <span
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Klicken Sie auf das Bild für eine größere Vorschau
              </span>
            </div>
          )}

          {filePreview === "pdf" && (
            <div className="mt-2 flex items-center space-x-2">
              <div
                className={`w-16 h-16 rounded-md flex items-center justify-center ${
                  darkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-gray-100 border-gray-300"
                } border cursor-pointer`}
                onClick={() => setShowPreviewModal(true)}
              >
                <FileText
                  size={32}
                  className={darkMode ? "text-gray-400" : "text-gray-500"}
                />
              </div>
              <span
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                PDF-Dokument (keine Vorschau verfügbar)
              </span>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                <span>Speichern...</span>
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" />
                <span>Transaktion speichern</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Image Preview Modal */}
      {showPreviewModal && filePreview && filePreview !== "pdf" && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div
            className={`relative max-w-3xl w-full rounded-lg overflow-hidden ${
              darkMode ? "bg-gray-800" : "bg-white"
            } p-2`}
          >
            <button
              onClick={() => setShowPreviewModal(false)}
              className="absolute top-3 right-3 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors z-10"
            >
              <X size={20} />
            </button>
            <img
              src={filePreview}
              alt="Beleg Vorschau"
              className="max-h-[80vh] max-w-full mx-auto object-contain"
            />
          </div>
        </div>
      )}

      {/* PDF Preview Modal - Just a placeholder since we can't actually preview PDFs */}
      {showPreviewModal && filePreview === "pdf" && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div
            className={`relative max-w-md w-full rounded-lg ${
              darkMode ? "bg-gray-800" : "bg-white"
            } p-6`}
          >
            <button
              onClick={() => setShowPreviewModal(false)}
              className="absolute top-3 right-3 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              <X size={20} />
            </button>
            <div className="flex flex-col items-center justify-center py-8">
              <FileText
                size={64}
                className={darkMode ? "text-gray-400" : "text-gray-500"}
              />
              <h3
                className={`mt-4 text-lg font-medium ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                PDF-Vorschau
              </h3>
              <p
                className={`mt-2 text-center ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                PDF-Vorschau ist in dieser Ansicht nicht verfügbar. Das Dokument
                wird nach dem Speichern der Transaktion verfügbar sein.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
