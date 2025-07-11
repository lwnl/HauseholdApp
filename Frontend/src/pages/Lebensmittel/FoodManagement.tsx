import React, { useState, useMemo } from "react";
import { LayoutGrid, CalendarDays } from "lucide-react";
import FoodList from "./FoodList";
import StatsSection from "./StatsSectionModel";
import AddItemModal from "./AddItemModal";
import EditItemModal from "./EditItemModal";
import SearchAndActions from "./Searchactions";
import { useLebensmittelService } from "../../Hooks/useLebensmittelService";
import { useDarkMode } from "../../context/DarkModeContext";
import type { Lebensmittel, CategoryType, UnitType } from "../../types";

const FoodManagement: React.FC = () => {
  const {
    lebensmittel,
    lebensmittelTypen,
    loading,
    error,
    createLebensmittel,
    updateLebensmittel,
    deleteLebensmittel,
  } = useLebensmittelService();

  const { darkMode } = useDarkMode();

  const [showCalendarView, setShowCalendarView] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Lebensmittel | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleCreateProduct = async (data: {
    name: string;
    category: CategoryType;
    einheit: UnitType;
    expirationDate: Date;
    preis?: number;
    menge: number;
  }) => {
    try {
      await createLebensmittel(data);
      setShowAddModal(false);
    } catch (err) {
      console.error("Error creating product:", err);
      alert("Fehler beim Erstellen des Produkts");
    }
  };

  const handleUpdateProduct = async (
    id: string,
    data: Partial<Lebensmittel>
  ) => {
    try {
      await updateLebensmittel(id, data);
      setShowEditModal(false);
      setSelectedItem(null);
    } catch (err) {
      console.error("Error updating product:", err);
      alert("Fehler beim Aktualisieren des Produkts");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteLebensmittel(id);
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Fehler beim Löschen des Produkts");
    }
  };

  const handleEditProduct = (product: Lebensmittel) => {
    setSelectedItem(product);
    setShowEditModal(true);
  };

  const filteredAndSortedLebensmittel = useMemo(() => {
    return lebensmittel
      .filter((item) => {
        const matchesSearch = searchTerm
          ? item.typ.name.toLowerCase().includes(searchTerm.toLowerCase())
          : true;
        const matchesCategory = selectedCategory
          ? item.typ.category === selectedCategory
          : true;
        const matchesProduct = selectedProduct
          ? item.typ._id === selectedProduct
          : true;
        const matchesStatus = selectedStatus
          ? item.status === selectedStatus
          : true;

        return (
          matchesSearch && matchesCategory && matchesProduct && matchesStatus
        );
      })
      .sort((a, b) => {
        if (sortBy === "name") {
          return sortDirection === "asc"
            ? a.typ.name.localeCompare(b.typ.name)
            : b.typ.name.localeCompare(a.typ.name);
        } else if (sortBy === "expirationDate") {
          const dateA = new Date(a.expirationDate).getTime();
          const dateB = new Date(b.expirationDate).getTime();
          return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
        }
        return 0;
      });
  }, [
    lebensmittel,
    searchTerm,
    selectedCategory,
    selectedProduct,
    selectedStatus,
    sortBy,
    sortDirection,
  ]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-center">
          <p className="text-xl font-semibold mb-2">
            Ein Fehler ist aufgetreten
          </p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen py-30 px-4 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Produktverwaltung</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCalendarView(false)}
              className={`p-2 rounded-lg transition-colors ${
                !showCalendarView
                  ? "bg-blue-100 text-blue-600"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
              title="Liste"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowCalendarView(true)}
              className={`p-2 rounded-lg transition-colors ${
                showCalendarView
                  ? "bg-blue-100 text-blue-600"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
              title="Kalender"
            >
              <CalendarDays className="w-5 h-5" />
            </button>
          </div>
        </div>

        <SearchAndActions
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setShowAddModal={setShowAddModal}
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
          darkMode={darkMode}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          lebensmittelTypen={lebensmittelTypen}
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
        />

        <StatsSection lebensmittel={lebensmittel} darkMode={darkMode} />

        <FoodList
          showCalendarView={showCalendarView}
          lebensmittel={filteredAndSortedLebensmittel}
          lebensmittelTypen={lebensmittelTypen}
          darkMode={darkMode}
          onUpdate={handleUpdateProduct}
          onDelete={handleDeleteProduct}
          onEdit={handleEditProduct}
          allItems={lebensmittel}
        />

        <AddItemModal
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
          onCreate={handleCreateProduct}
          darkMode={darkMode}
        />

        <EditItemModal
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          item={selectedItem}
          onUpdate={handleUpdateProduct}
          darkMode={darkMode}
          allItems={lebensmittel}
        />
      </div>
    </div>
  );
};

export default FoodManagement;
