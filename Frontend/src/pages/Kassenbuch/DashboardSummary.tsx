import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { useKassenbuch } from "../../context/KassenbuchContext";

interface DashboardSummaryProps {
  darkMode: boolean;
}

const DashboardSummary = ({ darkMode }: DashboardSummaryProps) => {
  const { kontostand, incomeTotal, expenseTotal, loading } = useKassenbuch();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(amount / 100);
  };

  return (
    <div className={`mb-8 p-6 rounded-lg shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Kontostand Card */}
        <div className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-700 text-white" : "bg-gray-50 text-gray-800"}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Kontostand</h2>
            <Wallet className={`${kontostand >= 0 ? "text-green-500" : "text-red-500"}`} size={24} />
          </div>
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full mr-2"></div>
              <span>Wird geladen...</span>
            </div>
          ) : (
            <p className={`text-3xl font-bold ${kontostand >= 0 ? "text-green-500" : "text-red-500"}`}>
              {formatCurrency(kontostand)}
            </p>
          )}
        </div>

        {/* Eingänge Card */}
        <div className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-700 text-white" : "bg-gray-50 text-gray-800"}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Eingänge</h2>
            <TrendingUp className="text-green-500" size={24} />
          </div>
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full mr-2"></div>
              <span>Wird geladen...</span>
            </div>
          ) : (
            <p className="text-3xl font-bold text-green-500">{formatCurrency(incomeTotal)}</p>
          )}
        </div>

        {/* Ausgänge Card */}
        <div className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-700 text-white" : "bg-gray-50 text-gray-800"}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Ausgänge</h2>
            <TrendingDown className="text-red-500" size={24} />
          </div>
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full mr-2"></div>
              <span>Wird geladen...</span>
            </div>
          ) : (
            <p className="text-3xl font-bold text-red-500">{formatCurrency(expenseTotal)}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;