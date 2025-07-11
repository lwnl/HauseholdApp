import React, { useState, useEffect } from "react";
import { Edit3, Tag, Save, Trash2 } from "lucide-react";
import type { LebensmittelTyp } from "../../types";

interface EditProductModalProps {
  modalIsOpen: boolean;
  setModalIsOpen: (isOpen: boolean) => void;
  product: LebensmittelTyp | null;
  handleUpdateProduct: (
    id: string,
    updatedData: Partial<LebensmittelTyp>
  ) => void;
  handleDeleteProduct: (id: string) => void;
  darkMode: boolean;
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  modalIsOpen,
  setModalIsOpen,
  product,
  handleUpdateProduct,
  handleDeleteProduct,
  darkMode,
}) => {
  const [name, setName] = useState(product?.name || "");

  useEffect(() => {
    if (product) {
      setName(product.name);
    }
  }, [product]);

  const handleSave = () => {
    if (product) {
      handleUpdateProduct(product._id, { name });
      setModalIsOpen(false);
    }
  };

  const handleDelete = () => {
    if (product) {
      handleDeleteProduct(product._id);
      setModalIsOpen(false);
    }
  };

  if (!modalIsOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className={`rounded-lg p-6 max-w-md w-full ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h2
          className={`flex items-center text-xl font-bold mb-4 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          <Edit3 className="mr-2" /> Produktname bearbeiten
        </h2>
        <div className="space-y-4">
          <div className="flex items-center">
            <Tag className="mr-2" />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Produktname"
              className={`flex-1 p-2 border rounded-md ${
                darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"
              } border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={() => setModalIsOpen(false)}
            className="px-4 py-2 border-2 border-[#a1c4fd] text-[#4a90e2] rounded-xl hover:border-[#c2e9fb] hover:text-[#2196f3] transition-colors duration-300"
          >
            Abbrechen
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-gradient-to-r from-[#a1c4fd] to-[#c2e9fb] text-[#4a90e2] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
          >
            <Save className="mr-2" /> Speichern
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
          >
            <Trash2 className="mr-2" /> Löschen
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
