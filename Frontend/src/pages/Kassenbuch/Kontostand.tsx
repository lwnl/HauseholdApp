import { fetchKontostand } from "../../api/transactionApi";
import { useQuery } from "react-query";
import useDarkMode from "../../context/useDarkMode";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";

type KontostandProps = {
  option: "both" | "income" | "expense";
};

export function Kontostand(props: KontostandProps) {
  const { option } = props;
  const { darkMode } = useDarkMode();

  const {
    data: balance,
    isLoading,
    isError,
  } = useQuery<number>({
    queryKey: ["kontostand", option],
    queryFn: () => fetchKontostand(option),
    refetchInterval: 5000,
  });

  function formatCurrency(balance: number) {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(balance / 100);
  }

  const getTitle = () => {
    switch (option) {
      case "income":
        return "Eingänge";
      case "expense":
        return "Ausgänge";
      default:
        return "Kontostand";
    }
  };

  const getIcon = () => {
    switch (option) {
      case "income":
        return <TrendingUp size={24} className="text-green-500" />;
      case "expense":
        return <TrendingDown size={24} className="text-red-500" />;
      default:
        return (
          <Wallet
            size={24}
            className={
              balance && balance < 0 ? "text-red-500" : "text-green-500"
            }
          />
        );
    }
  };

  const getTextColor = () => {
    switch (option) {
      case "income":
        return "text-green-500";
      case "expense":
        return "text-red-500";
      default:
        return balance && balance < 0 ? "text-red-500" : "text-green-500";
    }
  };

  return (
    <div className="mb-6">
      <div
        className={`p-4 rounded-lg ${
          darkMode ? "bg-gray-700" : "bg-gray-50"
        } flex items-center justify-between`}
      >
        <div className="flex items-center">
          {getIcon()}
          <h2
            className={`ml-3 text-xl font-semibold ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            {getTitle()}
          </h2>
        </div>

        <div className={`text-2xl font-bold ${getTextColor()}`}>
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full mr-2"></div>
              <span>Wird geladen...</span>
            </div>
          ) : isError ? (
            <span className="text-red-500 text-base">Fehler beim Laden</span>
          ) : (
            formatCurrency(balance || 0)
          )}
        </div>
      </div>
    </div>
  );
}
