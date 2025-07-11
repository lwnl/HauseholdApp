import { useState } from "react";
import {
  Pencil,
  Trash2,
  Save,
  X,
  Image,
  FileText as PdfIcon,
} from "lucide-react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { de } from "date-fns/locale"; // 德语本地化

export type Transaktion = {
  _id: string;
  date: Date;
  amount: number;
  description: string;
  category: string;
  type: "income" | "expense";
  image: string;
};

type TransactionProps = {
  transaction: Transaktion;
  onDelete: (deletedTransactionId: string) => void;
  showReceipt: (transactionId: string) => void;
  onUpdate: (
    transactionId: string,
    updatedTransaction: Transaktion,
    receiptFile?: File
  ) => void;
  isEditing: boolean;
  updatedTransaction: Partial<Transaktion>;
  onEdit: (transactionId: string) => void;
  onCancelEdit: () => void;
  darkMode: boolean;
};

export default function TransactionItem({
  transaction,
  onDelete,
  showReceipt,
  onUpdate,
  isEditing,
  updatedTransaction,
  onEdit,
  onCancelEdit,
  darkMode,
}: TransactionProps) {
  const { _id, date, description, category, type, image } = transaction;
  const amount = transaction.amount;

  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const transactionDate =
    date instanceof Date && !isNaN(date.getTime()) ? date : new Date(date);

  // 保持 state 使用 ISO 格式
  const [updatedDate, setUpdatedDate] = useState(
    updatedTransaction?.date
      ? new Date(updatedTransaction.date).toISOString().split("T")[0]
      : transactionDate.toISOString().split("T")[0]
  );
  const [updatedAmount, setUpdatedAmount] = useState(
    updatedTransaction?.amount ?? amount / 100
  );
  const [updatedDescription, setUpdatedDescription] = useState(
    updatedTransaction?.description || description
  );
  const [updatedCategory, setUpdatedCategory] = useState(
    updatedTransaction?.category || category
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setReceiptFile(e.target.files[0]);
    }
  };

  function formatCurrency(balance: number) {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(balance / 100);
  }

  const handleSave = async () => {
    const updatedTransaction: Transaktion = {
      ...transaction,
      date: new Date(updatedDate),
      amount: updatedAmount,
      description: updatedDescription,
      category: updatedCategory,
    };

    const fileToUpdate = receiptFile ?? undefined;

    await onUpdate(_id, updatedTransaction, fileToUpdate);
  };

  if (isEditing) {
    return (
      <div
        className={`py-4 px-4 ${
          darkMode
            ? "hover:bg-gray-800 bg-gray-700"
            : "hover:bg-gray-300 bg-gray-200"
        } transition-colors`}
      >
        <form className="grid grid-cols-12 gap-4">
          <div className="col-span-12 sm:col-span-2">
            <DatePicker
              selected={updatedDate ? new Date(updatedDate) : null}
              onChange={(date: Date | null) => {
                if (date) {
                  const isoDate = date.toISOString().split("T")[0];
                  setUpdatedDate(isoDate);
                } else {
                  setUpdatedDate(""); // 清空日期
                }
              }}
              dateFormat="dd.MM.yyyy"
              locale={de}
              placeholderText="TT.MM.JJJJ"
              className={`w-full rounded-md border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
              showYearDropdown
              dropdownMode="select"
              isClearable
            />
          </div>

          <div className="col-span-12 sm:col-span-4">
            <input
              type="text"
              value={updatedDescription}
              onChange={(e) => setUpdatedDescription(e.target.value)}
              className={`w-full rounded-md border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          <div className="col-span-12 sm:col-span-2">
            <input
              type="text"
              value={updatedCategory}
              onChange={(e) => setUpdatedCategory(e.target.value)}
              className={`w-full rounded-md border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          <div className="col-span-12 sm:col-span-2">
            <input
              type="number"
              value={updatedAmount}
              onChange={(e) => setUpdatedAmount(Number(e.target.value))}
              className={`w-full rounded-md border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          <div className="col-span-12 sm:col-span-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={handleSave}
              className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
              title="Speichern"
            >
              <Save size={16} />
            </button>
            <button
              type="button"
              onClick={onCancelEdit}
              className="p-2 rounded-full bg-gray-500 text-white hover:bg-gray-600 transition-colors"
              title="Abbrechen"
            >
              <X size={16} />
            </button>
          </div>

          <div className="col-span-12 mt-2">
            <label
              className={`block text-sm font-medium mb-1 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Beleg {image ? "(bereits vorhanden)" : ""}
            </label>
            <input
              type="file"
              name="image"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className={`w-full rounded-md border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
        </form>
      </div>
    );
  }

  return (
    <div
      className={`py-4 px-4 ${
        darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
      } transition-colors`}
    >
      <div className="grid grid-cols-12 gap-4 items-center">
        <div className="col-span-12 sm:col-span-2">
          <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
            {transactionDate.toLocaleDateString("de-DE")}
          </span>
        </div>

        <div className="col-span-12 sm:col-span-4">
          <span className={darkMode ? "text-white" : "text-gray-900"}>
            {description}
          </span>
        </div>

        <div className="col-span-12 sm:col-span-2">
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              category
                ? darkMode
                  ? "bg-gray-700 text-gray-300"
                  : "bg-gray-100 text-gray-800"
                : "hidden"
            }`}
          >
            {category}
          </span>
        </div>

        <div className="col-span-12 sm:col-span-2 text-right">
          <span
            className={`font-medium ${
              type === "income" ? "text-green-500" : "text-red-500"
            }`}
          >
            {`${type === "income" ? "+" : "-"}${formatCurrency(amount)}`}
          </span>
        </div>

        <div className="col-span-12 sm:col-span-2 flex items-center justify-end space-x-2">
          {image && (
            <button
              type="button"
              onClick={() => showReceipt(_id)}
              className={`p-2 rounded-full ${
                darkMode
                  ? "bg-gray-700 text-blue-400 hover:bg-gray-600"
                  : "bg-gray-100 text-blue-600 hover:bg-gray-200"
              } transition-colors`}
              title="Beleg anzeigen"
            >
              {image.endsWith("webp") ? (
                <Image size={16} />
              ) : (
                <PdfIcon size={16} />
              )}
            </button>
          )}

          <button
            type="button"
            onClick={() => onEdit(_id)}
            className={`p-2 rounded-full ${
              darkMode
                ? "bg-gray-700 text-green-400 hover:bg-gray-600"
                : "bg-gray-100 text-green-600 hover:bg-gray-200"
            } transition-colors`}
            title="Bearbeiten"
          >
            <Pencil size={16} />
          </button>

          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            className={`p-2 rounded-full ${
              darkMode
                ? "bg-gray-700 text-red-400 hover:bg-gray-600"
                : "bg-gray-100 text-red-600 hover:bg-gray-200"
            } transition-colors`}
            title="Löschen"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {showConfirm && (
        <div
          className={`mt-3 p-3 rounded-lg ${
            darkMode ? "bg-gray-900" : "bg-gray-200"
          }`}
        >
          <p className={darkMode ? "text-white" : "text-gray-800"}>
            Möchten Sie diese Transaktion wirklich löschen?
          </p>
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={() => {
                onDelete(_id);
                setShowConfirm(false);
              }}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Ja
            </button>
            <button
              type="button"
              onClick={() => setShowConfirm(false)}
              className={`px-3 py-1 rounded ${
                darkMode
                  ? "bg-gray-600 text-white hover:bg-gray-500"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              } transition-colors`}
            >
              Nein
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
