import React from "react";
import { Plus, Minus, Trash2 } from "lucide-react";
import type { LebensmittelTyp } from "../../api/einkaufslisteApi";

interface SelectedArticlesProps {
  selectedArticles: LebensmittelTyp[];
  handleQuantityChange: (id: string, change: number) => void;
  handleRemoveArticle: (id: string) => void;
  darkMode: boolean;
}

const SelectedArticles: React.FC<SelectedArticlesProps> = ({
  selectedArticles,
  handleQuantityChange,
  handleRemoveArticle,
  darkMode,
}) => {
  const getDisplayQuantity = (article: LebensmittelTyp): number => {
    return typeof article.menge === "number" && article.menge > 0
      ? article.menge
      : 1;
  };

  return (
    <div className={`p-4 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
      <h3 className="font-semibold mb-3">
        Ausgewählte Artikel ({selectedArticles.length})
      </h3>
      <div className="space-y-2">
        {selectedArticles.map((article) => {
          const quantity = getDisplayQuantity(article);

          return (
            <div
              key={article._id}
              className={`flex items-center justify-between p-3 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-gray-50"
              }`}
            >
              <div className="flex flex-col">
                <span className="font-medium">{article.name}</span>
                <span
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {article.einheit}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuantityChange(article._id, -1)}
                    className={`p-1.5 rounded-full transition-colors ${
                      darkMode
                        ? "hover:bg-gray-600 text-gray-300"
                        : "hover:bg-gray-200 text-gray-600"
                    } ${quantity <= 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={quantity <= 1}
                    title="Menge reduzieren"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(article._id, 1)}
                    className={`p-1.5 rounded-full transition-colors ${
                      darkMode
                        ? "hover:bg-gray-600 text-gray-300"
                        : "hover:bg-gray-200 text-gray-600"
                    }`}
                    title="Menge erhöhen"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => handleRemoveArticle(article._id)}
                  className={`p-1.5 rounded-full transition-colors ${
                    darkMode
                      ? "hover:bg-red-900/50 text-red-400"
                      : "hover:bg-red-100 text-red-600"
                  }`}
                  title="Artikel entfernen"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SelectedArticles;
