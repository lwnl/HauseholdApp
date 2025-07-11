import React, { useState, useCallback } from "react";
import CalendarView from "./CalenderView";
import ListView from "./Listview";
import type { LebensmittelItem } from "../../Hooks/useLebensmittelService";
import type { Lebensmittel, LebensmittelTyp } from "../../types";

interface FoodListProps {
  showCalendarView: boolean;
  lebensmittel: Lebensmittel[];
  lebensmittelTypen?: LebensmittelTyp[];
  darkMode: boolean;
  onUpdate: (id: string, data: Partial<Lebensmittel>) => void;
  onDelete: (id: string) => void;
  onEdit: (item: Lebensmittel) => void;
  allItems?: Lebensmittel[];
}

const FoodList: React.FC<FoodListProps> = ({
  showCalendarView,
  lebensmittel = [],
  darkMode,
  onDelete,
  onEdit,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Convert Lebensmittel to LebensmittelItem for the components
  const lebensmittelItems: LebensmittelItem[] = lebensmittel.map((item) => ({
    id: item._id,
    name: item.typ.name,
    quantity: item.menge,
    expiryDate: item.expirationDate,
    category: item.typ.category,
    purchaseDate: item.purchaseDate,
    status: item.status,
    _id: item._id,
    typ: item.typ,
    expirationDate: item.expirationDate,
    menge: item.menge,
    preis: item.preis,
  }));

  const getItemsForDate = useCallback(
    (date: Date) => {
      return lebensmittelItems.filter((item) => {
        const itemDate = new Date(item.expiryDate);
        return (
          itemDate.getFullYear() === date.getFullYear() &&
          itemDate.getMonth() === date.getMonth() &&
          itemDate.getDate() === date.getDate()
        );
      });
    },
    [lebensmittelItems]
  );

  // Handle conversion back from LebensmittelItem to Lebensmittel for callbacks
  const handleItemEdit = (item: LebensmittelItem) => {
    const originalItem = lebensmittel.find((l) => l._id === item.id);
    if (originalItem) {
      onEdit(originalItem);
    }
  };

  const handleItemDelete = (id: string) => {
    onDelete(id);
  };

  return showCalendarView ? (
    <CalendarView
      lebensmittel={lebensmittelItems}
      currentMonth={currentMonth}
      setCurrentMonth={setCurrentMonth}
      getItemsForDate={getItemsForDate}
      darkMode={darkMode}
      onDelete={handleItemDelete}
      onEdit={handleItemEdit}
    />
  ) : (
    <ListView
      products={lebensmittelItems}
      darkMode={darkMode}
      onDelete={handleItemDelete}
      onEdit={handleItemEdit}
    />
  );
};

export default FoodList;
