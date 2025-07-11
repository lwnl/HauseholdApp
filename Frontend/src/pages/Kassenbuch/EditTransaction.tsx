import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchTransaktions, updateTransaktion } from "../../api/transactionApi";
import useDarkMode from "../../context/useDarkMode";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";

const EditTransaction = () => {
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    date: "",
    amount: "",
    description: "",
    category: "",
    type: "expense" as "income" | "expense",
    image: null as File | null,
    hasExistingImage: false,
  });

  useEffect(() => {
    const loadTransaction = async () => {
      if (!id) return;

      try {
        const transactions = await fetchTransaktions();
        const transaction = transactions.find((t) => t._id === id);

        if (!transaction) {
          setError("Transaktion nicht gefunden");
          return;
        }

        // Format date for input field (YYYY-MM-DD)
        const date = new Date(transaction.date);
        const formattedDate = date.toISOString().split("T")[0];

        // Format amount for input field
        const amountStr = (transaction.amount / 100)
          .toFixed(2)
          .replace(".", ",");

        setFormData({
          date: formattedDate,
          amount: amountStr,
          description: transaction.description,
          category: transaction.category || "",
          type: transaction.type,
          image: null,
          hasExistingImage: !!transaction.image,
        });
      } catch (err) {
        console.error("Error loading transaction:", err);
        setError("Fehler beim Laden der Transaktion");
      } finally {
        setLoading(false);
      }
    };

    loadTransaction();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleTypeChange = (type: "income" | "expense") => {
    setFormData((prev) => ({ ...prev, type }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSubmitting(true);
    setError(null);

    try {
      // Convert form data to the expected format
      const transactionData = {
        date: new Date(formData.date),
        amount: parseFloat(formData.amount.replace(",", ".")) * 100, // Convert to cents
        description: formData.description,
        category: formData.category,
        type: formData.type,
      };

      // If there's an image, handle it separately with FormData
      if (formData.image) {
        const data = new FormData();
        data.append("date", formData.date);
        data.append("amount", formData.amount);
        data.append("description", formData.description);
        data.append("category", formData.category);
        data.append("type", formData.type);
        data.append("image", formData.image);

        // Use axios directly for file upload
        await updateTransaktion(id, transactionData);
      } else {
        // No file, just update the transaction data
        await updateTransaktion(id, transactionData);
      }

      navigate("/kassenbuch");
    } catch (err) {
      console.error("Error updating transaction:", err);
      setError(
        "Fehler beim Aktualisieren der Transaktion. Bitte versuchen Sie es erneut."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && !formData.date) {
    return (
      <div
        className={`rounded-lg shadow-md ${
          darkMode ? "bg-gray-800" : "bg-white"
        } p-6`}
      >
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => navigate("/kassenbuch")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Zurück zum Kassenbuch
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg shadow-md ${
        darkMode ? "bg-gray-800" : "bg-white"
      } p-6`}
    >
      <h2
        className={`text-xl font-bold mb-6 ${
          darkMode ? "text-white" : "text-gray-800"
        }`}
      >
        Transaktion bearbeiten
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <div className="flex space-x-4 mb-4">
            <button
              type="button"
              onClick={() => handleTypeChange("income")}
              className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 ${
                formData.type === "income"
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
              onClick={() => handleTypeChange("expense")}
              className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 ${
                formData.type === "expense"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="date"
                className={`block text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Datum
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className={`w-full rounded-md border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            <div>
              <label
                htmlFor="amount"
                className={`block text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Betrag (€)
              </label>
              <input
                type="text"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0,00"
                required
                className={`w-full rounded-md border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className={`block text-sm font-medium mb-1 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Beschreibung
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className={`w-full rounded-md border ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="category"
            className={`block text-sm font-medium mb-1 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Kategorie
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full rounded-md border ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="image"
            className={`block text-sm font-medium mb-1 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Beleg {formData.hasExistingImage && "(bereits vorhanden)"}
          </label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleFileChange}
            accept="image/*,.pdf"
            className={`w-full rounded-md border ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {formData.hasExistingImage && (
            <p
              className={`mt-1 text-xs ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Ein neuer Beleg ersetzt den vorhandenen.
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate("/kassenbuch")}
            className={`px-4 py-2 rounded-md ${
              darkMode
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Abbrechen
          </button>

          <button
            type="submit"
            disabled={submitting}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center ${
              submitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {submitting ? (
              <>
                <span className="mr-2">Speichern</span>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              </>
            ) : (
              "Speichern"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTransaction;
