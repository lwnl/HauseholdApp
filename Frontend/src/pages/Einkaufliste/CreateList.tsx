import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  saveEinkaufsliste,
  fetchLebensmittelTypen,
  updateLebensmittelTyp,
  deleteLebensmittelTyp,
  type LebensmittelTyp,
} from "../../api/einkaufslisteApi";
import { createLebensmittelTyp } from "../../api/lebensmittelApi";
import {
  Apple,
  Flower2,
  Beef,
  Coffee,
  Wine,
  Cookie,
  Heading as Bread,
  Snowflake,
  Package,
  User,
  Calendar,
} from "lucide-react";
import { useDarkMode } from "../../context/DarkModeContext";
import { useToast } from "../../context/ToastContext";
import CategorySelector from "./CategorySelector";
import ProductGrid from "./ProductGrid";
import SelectedArticles from "./SelectedArticles";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import type { CategoryType, UnitType } from "../../types";

interface Category {
  id: CategoryType;
  name: string;
  color: string;
  icon: React.ElementType;
}

const categories: Category[] = [
  { id: "obst", name: "Obst", color: "#a1c4fd", icon: Apple },
  { id: "gemüse", name: "Gemüse", color: "#c2e9fb", icon: Flower2 },
  { id: "fleisch", name: "Fleisch", color: "#fad0c4", icon: Beef },
  { id: "milchprodukt", name: "Milch Pro.", color: "#fbc2eb", icon: Coffee },
  { id: "getränk", name: "Getränk", color: "#a6c1ee", icon: Wine },
  { id: "teigwaren", name: "Teigwaren", color: "#fbc2eb", icon: Cookie },
  { id: "brot", name: "Brot", color: "#fbc2eb", icon: Bread },
  { id: "tiefkühl", name: "Tiefkühl", color: "#a6c1ee", icon: Snowflake },
  { id: "anderes", name: "Anderes", color: "#a8edea", icon: Package },
];

export default function CreateList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { darkMode } = useDarkMode();
  const { showToast } = useToast();
  const [listName, setListName] = useState("");
  const [note, setNote] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>(
    categories[0].id
  );
  const [selectedArticles, setSelectedArticles] = useState<LebensmittelTyp[]>(
    []
  );
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newProductCategory, setNewProductCategory] = useState<CategoryType>(
    categories[0].id
  );
  const [newProductEinheit, setNewProductEinheit] = useState<UnitType>("stk");
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<LebensmittelTyp | null>(
    null
  );

  const openEditModal = (product: LebensmittelTyp) => {
    setProductToEdit(product);
    setEditModalIsOpen(true);
  };

  const { data: products = [] } = useQuery({
    queryKey: ["lebensmittelTypen"],
    queryFn: fetchLebensmittelTypen,
    staleTime: 0,
  });

  const saveMutation = useMutation({
    mutationFn: ({
      listName,
      selectedArticles,
      // ownerId,
      note,
    }: {
      listName: string;
      selectedArticles: LebensmittelTyp[];
      // ownerId: string;
      note?: string;
    }) => saveEinkaufsliste(listName, selectedArticles, note ?? ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["einkaufsliste"] });
      showToast("Einkaufsliste wurde erfolgreich erstellt", "success");
      navigate("/einkaufliste");
    },
    onError: () => {
      showToast("Fehler beim Speichern der Einkaufsliste", "error");
    },
  });

  const addProductMutation = useMutation({
    mutationFn: createLebensmittelTyp,
    onSuccess: (newProduct) => {
      queryClient.invalidateQueries({ queryKey: ["lebensmittelTypen"] });
      handleProductSelect(newProduct);
      setModalIsOpen(false);
      showToast(`${newProduct.name} wurde zur Liste hinzugefügt`, "success");
    },
    onError: () => {
      showToast("Fehler beim Hinzufügen des Produkts", "error");
    },
  });

  const handleProductSelect = (product: LebensmittelTyp) => {
    setSelectedArticles((prevArticles) => {
      const existingArticle = prevArticles.find((a) => a._id === product._id);
      if (existingArticle) {
        return prevArticles.map((article) =>
          article._id === product._id
            ? { ...article, menge: article.menge + 1 }
            : article
        );
      }
      return [...prevArticles, { ...product, menge: 1 }];
    });
  };

  const handleQuantityChange = (id: string, change: number) => {
    setSelectedArticles((prevArticles) =>
      prevArticles.map((article) => {
        if (article._id === id) {
          const newQuantity = Math.max(1, article.menge + change);
          return { ...article, menge: newQuantity };
        }
        return article;
      })
    );
  };

  const handleRemoveArticle = (id: string) => {
    setSelectedArticles((prevArticles) =>
      prevArticles.filter((article) => article._id !== id)
    );
    showToast("Artikel wurde aus der Liste entfernt", "info");
  };

  const handleSave = () => {
    if (!listName.trim()) {
      showToast("Bitte geben Sie einen Listennamen ein", "error");
      return;
    }

    if (selectedArticles.length === 0) {
      showToast("Bitte wählen Sie mindestens einen Artikel aus", "error");
      return;
    }

    // const ownerId = "userId";

    saveMutation.mutate({
      listName,
      selectedArticles: selectedArticles.map((article) => ({
        ...article,
        menge: article.menge || 1,
      })),
      // ownerId,
      note,
    });
  };

  const handleAddProduct = () => {
    if (!newProductName.trim()) {
      showToast("Bitte geben Sie einen Produktnamen ein", "error");
      return;
    }

    addProductMutation.mutate({
      name: newProductName,
      category: newProductCategory,
      menge: 1,
      einheit: newProductEinheit,
      quelle:'userId'
    });
  };

  const updateProductMutation = useMutation({
    mutationFn: ({
      id,
      updatedData,
    }: {
      id: string;
      updatedData: Partial<LebensmittelTyp>;
    }) => updateLebensmittelTyp(id, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lebensmittelTypen"] });
      showToast("Produkt wurde erfolgreich aktualisiert", "success");
    },
    onError: () => {
      showToast("Fehler beim Aktualisieren des Produkts", "error");
    },
  });

  const handleUpdateProduct = (
    id: string,
    updatedData: Partial<LebensmittelTyp>
  ) => {
    updateProductMutation.mutate({ id, updatedData });
  };

  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => deleteLebensmittelTyp(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lebensmittelTypen"] });
      showToast("Produkt wurde erfolgreich gelöscht", "success");
    },
    onError: () => {
      showToast("Fehler beim Löschen des Produkts", "error");
    },
  });

  const handleDeleteProduct = (id: string) => {
    deleteProductMutation.mutate(id);
  };

  return (
    <div
      className={`min-h-screen py-30 ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-[#f6f8fb] to-[#e5ebf2]"
      }`}
    >
      <div className="max-w-7xl mx-auto mt-4 pt-4">
        {/* Header Section */}
        <div
          className={`rounded-xl shadow-lg overflow-hidden mb-6 ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="bg-gradient-to-r from-[#a1c4fd] to-[#c2e9fb] p-6">
            <h2 className="text-white text-2xl font-bold mb-4 text-center">
              Neue Einkaufsliste
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <User className="absolute left-3 top-6 -translate-y-1/2 text-white z-10" />
                <input
                  type="text"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  placeholder="Listenname"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg ${
                    darkMode
                      ? "bg-gray-700 text-white"
                      : "bg-white/90 text-gray-800"
                  } backdrop-blur-sm placeholder-gray-500`}
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-6 -translate-y-1/2 text-white z-10" />
                <input
                  type="text"
                  value={new Date().toLocaleDateString("de-DE", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  disabled
                  className={`w-full pl-10 pr-4 py-3 rounded-lg ${
                    darkMode
                      ? "bg-gray-700 text-white"
                      : "bg-white/90 text-gray-800"
                  } backdrop-blur-sm`}
                />
              </div>
              <div className="relative">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Notiz hinzufügen"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg h-14 resize-none ${
                    darkMode
                      ? "bg-gray-700 text-white"
                      : "bg-white/90 text-gray-800"
                  } backdrop-blur-sm placeholder-gray-500`}
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-gradient-to-r from-[#a1c4fd] to-[#c2e9fb] text-[#4a90e2] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Speichern
              </button>
            </div>
          </div>

          {/* Selected Articles */}
          {selectedArticles.length > 0 && (
            <SelectedArticles
              selectedArticles={selectedArticles}
              handleQuantityChange={handleQuantityChange}
              handleRemoveArticle={handleRemoveArticle}
              darkMode={darkMode}
            />
          )}
        </div>

        {/* Categories and Products */}
        <div className="flex flex-col md:flex-row gap-6">
          <CategorySelector 
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            darkMode={darkMode}
          />

          <ProductGrid
            products={products}
            selectedCategory={selectedCategory}
            handleProductSelect={handleProductSelect}
            darkMode={darkMode}
            handleProductEdit={openEditModal}
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-end">
          <button
            onClick={() => navigate("/einkaufliste")}
            className="px-6 py-3 border-2 border-[#a1c4fd] text-[#4a90e2] rounded-xl hover:border-[#c2e9fb] hover:text-[#2196f3] transition-colors duration-300"
          >
            Abbrechen
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-gradient-to-r from-[#a1c4fd] to-[#c2e9fb] text-[#4a90e2] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Speichern
          </button>
          <button
            onClick={() => setModalIsOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-[#a1c4fd] to-[#c2e9fb] text-[#4a90e2] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Produkt hinzufügen
          </button>
        </div>
      </div>

      {/* Add Product Modal */}
      <AddProductModal
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        newProductName={newProductName}
        setNewProductName={setNewProductName}
        newProductCategory={newProductCategory}
        setNewProductCategory={setNewProductCategory}
        newProductEinheit={newProductEinheit}
        setNewProductEinheit={setNewProductEinheit}
        categories={categories}
        handleAddProduct={handleAddProduct}
        darkMode={darkMode}
      />
      {/* Edit Product Modal */}
      <EditProductModal
        modalIsOpen={editModalIsOpen}
        setModalIsOpen={setEditModalIsOpen}
        product={productToEdit}
        handleUpdateProduct={handleUpdateProduct}
        handleDeleteProduct={handleDeleteProduct}
        darkMode={darkMode}
      />
    </div>
  );
}
