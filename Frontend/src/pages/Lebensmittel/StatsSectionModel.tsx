import React from "react";
import { PackageCheck, AlertTriangle, Wallet, PieChart } from "lucide-react";
import type { Lebensmittel } from "../../types";

interface StatsSectionProps {
  lebensmittel: Lebensmittel[];
  darkMode: boolean;
}

const StatsSection: React.FC<StatsSectionProps> = ({
  lebensmittel,
  darkMode,
}) => {
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  // Calculate basic statistics
  const stats = {
    total: lebensmittel.length,
    totalCost: 0,
    expiringSoon: 0,
    expired: 0,
    categories: {} as Record<
      string,
      {
        count: number;
        cost: number;
        items: Lebensmittel[];
      }
    >,
  };

  const nonOpenedLebensmittel = lebensmittel.filter(
    (item) => item.status !== "verbraucht"
  );

  // Calculate statistics
  if (nonOpenedLebensmittel.length > 0) {
    nonOpenedLebensmittel.forEach((item) => {
      const category = item.typ.category;
      const expirationDate = new Date(item.expirationDate);
      const cost = item.preis || 0;

      // Update category statistics
      if (!stats.categories[category]) {
        stats.categories[category] = { count: 0, cost: 0, items: [] };
      }
      stats.categories[category].count++;
      stats.categories[category].cost += cost;
      stats.categories[category].items.push(item);

      // Update total cost
      stats.totalCost += cost;

      // Count expiring and expired items
      if (expirationDate < now) {
        stats.expired++;
      } else if (expirationDate <= thirtyDaysFromNow) {
        stats.expiringSoon++;
      }
    });
  }

  // Find most stocked category
  const mostStockedCategory = Object.entries(stats.categories).reduce(
    (max, [category, data]) => {
      return data.count > (max.count || 0)
        ? { category, count: data.count }
        : max;
    },
    { category: "", count: 0 }
  );

  // Find highest value category
  const highestValueCategory = Object.entries(stats.categories).reduce(
    (max, [category, data]) => {
      return data.cost > (max.cost || 0) ? { category, cost: data.cost } : max;
    },
    { category: "", cost: 0 }
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div
        className={`p-4 rounded-lg shadow-md ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex items-center space-x-3">
          <div
            className={`p-2 rounded-lg ${
              darkMode ? "bg-blue-900/50" : "bg-blue-100"
            }`}
          >
            <PackageCheck
              className={`w-5 h-5 ${
                darkMode ? "text-blue-400" : "text-blue-600"
              }`}
            />
          </div>
          <div>
            <p
              className={`text-sm font-medium ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Gesamt Artikel
            </p>
            <p
              className={`text-xl font-bold ${
                darkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              {stats.total}
            </p>
          </div>
        </div>
        <p
          className={`text-xs mt-2 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {Object.keys(stats.categories).length} aktive Kategorien
        </p>
      </div>

      <div
        className={`p-4 rounded-lg shadow-md ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex items-center space-x-3">
          <div
            className={`p-2 rounded-lg ${
              darkMode ? "bg-green-900/50" : "bg-green-100"
            }`}
          >
            <Wallet
              className={`w-5 h-5 ${
                darkMode ? "text-green-400" : "text-green-600"
              }`}
            />
          </div>
          <div>
            <p
              className={`text-sm font-medium ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Gesamtkosten
            </p>
            <p
              className={`text-xl font-bold ${
                darkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              €{stats.totalCost.toFixed(2)}
            </p>
          </div>
        </div>
        <p
          className={`text-xs mt-2 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Höchster Wert: {highestValueCategory.category} (€
          {highestValueCategory.cost.toFixed(2)})
        </p>
      </div>

      <div
        className={`p-4 rounded-lg shadow-md ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex items-center space-x-3">
          <div
            className={`p-2 rounded-lg ${
              darkMode ? "bg-yellow-900/50" : "bg-yellow-100"
            }`}
          >
            <AlertTriangle
              className={`w-5 h-5 ${
                darkMode ? "text-yellow-400" : "text-yellow-600"
              }`}
            />
          </div>
          <div>
            <p
              className={`text-sm font-medium ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Läuft bald ab
            </p>
            <p
              className={`text-xl font-bold ${
                darkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              {stats.expiringSoon}
            </p>
          </div>
        </div>
        <p
          className={`text-xs mt-2 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {stats.expired} bereits abgelaufen
        </p>
      </div>

      <div
        className={`p-4 rounded-lg shadow-md ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex items-center space-x-3">
          <div
            className={`p-2 rounded-lg ${
              darkMode ? "bg-purple-900/50" : "bg-purple-100"
            }`}
          >
            <PieChart
              className={`w-5 h-5 ${
                darkMode ? "text-purple-400" : "text-purple-600"
              }`}
            />
          </div>
          <div>
            <p
              className={`text-sm font-medium ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Meist gelagert
            </p>
            <p
              className={`text-xl font-bold ${
                darkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              {mostStockedCategory.category || "-"}
            </p>
          </div>
        </div>
        <p
          className={`text-xs mt-2 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {mostStockedCategory.count} Artikel
        </p>
      </div>
    </div>
  );
};

export default StatsSection;
