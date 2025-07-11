import React from "react";
import { LebensmittelTyp } from "../../api/einkaufslisteApi";
import { Edit3 } from "lucide-react";

interface ProductGridProps {
  products: LebensmittelTyp[];
  selectedCategory: string;
  handleProductSelect: (product: LebensmittelTyp) => void;
  handleProductEdit: (product: LebensmittelTyp) => void;
  darkMode: boolean;
  className?: string
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  selectedCategory,
  handleProductSelect,
  handleProductEdit,
  darkMode,
  className = ''
}) => {
  if (!Array.isArray(products)) {
    console.error("Products is not an array:", products);
    return null;
  }

  return (
    <div className="w-full md:w-3/4 p-4 ">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products
          .filter((product) => selectedCategory === product.category)
          .map((product) => (
            <div
              key={product._id}
              className={`relative p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div onClick={() => handleProductSelect(product)}>
                <h3
                  className={`text-lg font-bold mb-2 ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {product.name}
                </h3>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {product.einheit}
                </p>
              </div>
              {product.quelle !== "system" && <button
                onClick={() => handleProductEdit(product)}
                className="absolute top-2 right-2 p-1 bg-yellow-500 text-white rounded-full hover:bg-yellow-600"
              >
                <Edit3 className="w-5 h-5" />
              </button>}
            </div>
          ))}
      </div>
    </div>
  );
};

export default ProductGrid;
