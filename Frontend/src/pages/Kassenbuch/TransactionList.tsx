import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import TransactionItem, { Transaktion } from "./TransactionItem";
import HOST from "../../context/HostContext";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Search,
  Calendar,
  FileText,
  Tag,
  DollarSign,
  Settings,
} from "lucide-react";
import useDarkMode from "../../context/useDarkMode";
import { useKassenbuch } from "../../context/KassenbuchContext";
import { useToast } from "../../context/ToastContext";

type TransactionListProps = {
  option1: string;
};

export default function TransactionList({ option1 }: TransactionListProps) {
  const { showToast } = useToast();
  const { darkMode } = useDarkMode();
  const [option2, setOption2] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<{
    [key: string]: boolean;
  }>({
    date: true,
    description: true,
    category: true,
    amount: true,
    image: true,
  });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const itemsPerPage = 5;
  const { reloadData } = useKassenbuch();

  // Bearbeitungsstatus
  const [transactions, setTransactions] = useState<Transaktion[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaktion[]
  >([]);
  const [editingTransaction, setEditingTransaction] = useState<{
    [key: string]: Partial<Transaktion>;
  }>({});
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [imgUrl, setImgUrl] = useState<string>("");

  const toggleSort = (field: string) => {
    setOption2(field);
    setSortDirection((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await axios.get<{
        message: string;
        transactions: Transaktion[];
      }>(
        `${HOST}/transaction/${option1}/${option2}/${sortDirection[option2]}`,
        { withCredentials: true }
      );
      setTransactions(response.data.transactions);
      setCurrentPage(1);
    } catch (error) {
      console.error("Fehler beim Abrufen der Transaktionen:", error);
      showToast("Fehler beim Abrufen der Transaktionen:", 'error');
    }
  }, [option1, option2, sortDirection]);

  const transactionsAfterFiltered = useMemo(() => {
    return searchTerm.trim() === ""
      ? transactions
      : transactions.filter(
          (transaction) =>
            transaction.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
  }, [transactions, searchTerm]);


  useEffect(() => {
    fetchTransactions();
    setFilteredTransactions(transactionsAfterFiltered)
  }, [fetchTransactions, transactionsAfterFiltered]);

  // Bearbeitungsstatus behandeln
  const handleEditTransaction = (transactionId: string) => {
    const transactionToEdit = transactions.find(
      (trans) => trans._id === transactionId
    );
    if (transactionToEdit) {
      setEditingTransaction({
        [transactionId]: {
          ...transactionToEdit,
          date: new Date(transactionToEdit.date),
        },
      });
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingTransaction({});
  };

  const handleSaveClick = async (
    transactionId: string,
    updatedTransaction: Transaktion,
    receiptFile: File | undefined
  ) => {
    try {
      const formData = new FormData();
      formData.append("date", updatedTransaction.date.toISOString());
      formData.append("amount", updatedTransaction.amount.toString()); // Convert to cents
      formData.append("description", updatedTransaction.description);
      formData.append("category", updatedTransaction.category);
      formData.append("type", updatedTransaction.type);

      if (receiptFile) {
        formData.append("image", receiptFile);
      }

      const response = await axios.patch<{
        message: string;
        updatedTransaction: Transaktion;
      }>(`${HOST}/transaction/alter/${transactionId}`, formData, {
        withCredentials: true,
      });

      const updatedTransactionFromServer = response.data.updatedTransaction;

      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction._id === transactionId
            ? updatedTransactionFromServer
            : transaction
        )
      );

      setIsEditing(false);
      setEditingTransaction({});
      reloadData()
    } catch (error) {
      console.error("Fehler beim Update der Transaktion:", error);
      showToast("Fehler beim Update der Transaktion:", 'error')
    }
  };

  // Löschvorgang verarbeiten
  const handleDeleteTransaction = async (deletedTransactionId: string) => {
    try {
      await axios.delete(`${HOST}/transaction/delete/${deletedTransactionId}`, {
        withCredentials: true,
      });
      setTransactions((prevTransactions) =>
        prevTransactions.filter(
          (transaction) => transaction._id !== deletedTransactionId
        )
      );
      reloadData();
    } catch (error) {
      console.error("Fehler beim Löschen der Transaktion:", error);
      showToast("Fehler beim Löschen der Transaktion:", 'error');
    }
  };

  const showReceipt = async (transactionId: string) => {
    const url = `${HOST}/transaction/receipt/${transactionId}`;
    try {
      const response = await axios.get(url, { withCredentials: true });
      const contentType = response.headers["content-type"];
      if (contentType.includes("application/pdf")) {
        if (pdfUrl === url) {
          setPdfUrl("");
        } else {
          setPdfUrl(url);
          setImgUrl("");
        }
      } else {
        if (imgUrl === url) {
          setImgUrl("");
        } else {
          setImgUrl(url);
          setPdfUrl("");
        }
      }
    } catch (error) {
      console.error("Fehler beim Abrufen der Quittung", error);
      showToast("Fehler beim Abrufen der Quittung", 'error');
    }
  };

  // Pagination-Logik
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(
    startIndex,
    endIndex
  );
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  return (
    <div>
      {/* Search and filter bar */}
      <div className="mb-4 flex flex-col sm:flex-row gap-4">
        <div
          className={`relative flex-1 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search
              size={18}
              className={darkMode ? "text-gray-400" : "text-gray-500"}
            />
          </div>
          <input
            type="text"
            placeholder="Suche nach Beschreibung oder Kategorie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`pl-10 pr-4 py-2 w-full rounded-lg border ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>
      </div>

      {/* Table header */}
      <div
        className={`grid grid-cols-12 gap-4 py-3 px-4 rounded-t-lg font-medium ${
          darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-700"
        }`}
      >
        <div className="col-span-2 flex items-center">
          <button
            className="flex items-center gap-1 hover:text-blue-500 transition-colors"
            onClick={() => toggleSort("date")}
          >
            <span className="hidden sm:inline">Datum</span>
            <Calendar className="sm:hidden" size={14} />
            <ArrowUpDown
              size={14}
              className={option2 === "date" ? "text-blue-500" : ""}
            />
          </button>
        </div>
        <div className="col-span-4 flex items-center">
          <button
            className="flex items-center gap-1 hover:text-blue-500 transition-colors"
            onClick={() => toggleSort("description")}
          >
            <span className="hidden sm:inline">Beschreibung</span>
            <FileText className="sm:hidden" size={14} />
            <ArrowUpDown
              size={14}
              className={option2 === "description" ? "text-blue-500" : ""}
            />
          </button>
        </div>
        <div className="col-span-2 flex items-center">
          <button
            className="flex items-center gap-1 hover:text-blue-500 transition-colors"
            onClick={() => toggleSort("category")}
          >
            <span className="hidden sm:inline">Kategorie</span>
            <Tag className="sm:hidden" size={14} />
            <ArrowUpDown
              size={14}
              className={option2 === "category" ? "text-blue-500" : ""}
            />
          </button>
        </div>
        <div className="col-span-2 flex items-center justify-end">
          <button
            className="flex items-center gap-1 hover:text-blue-500 transition-colors"
            onClick={() => toggleSort("amount")}
          >
            <span className="hidden sm:inline">Betrag</span>
            <DollarSign className="sm:hidden" size={14} />
            <ArrowUpDown
              size={14}
              className={option2 === "amount" ? "text-blue-500" : ""}
            />
          </button>
        </div>
        <div className="col-span-2 flex items-center justify-end">
          <span className="hidden sm:inline">Aktionen</span>
          <Settings className="sm:hidden" size={14} />
        </div>
      </div>

      {/* Transaction list */}
      <div
        className={`rounded-b-lg overflow-hidden ${
          darkMode ? "bg-gray-800" : "bg-white"
        } divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"}`}
      >
        {filteredTransactions.length > 0 ? (
          paginatedTransactions.map((transaction) => (
            <TransactionItem
              key={transaction._id}
              transaction={transaction}
              onDelete={handleDeleteTransaction}
              showReceipt={showReceipt}
              onUpdate={handleSaveClick}
              isEditing={isEditing && !!editingTransaction[transaction._id]}
              updatedTransaction={editingTransaction[transaction._id]}
              onEdit={handleEditTransaction}
              onCancelEdit={handleCancelEdit}
              darkMode={darkMode}
            />
          ))
        ) : (
          <div
            className={`py-8 text-center ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {searchTerm
              ? "Keine Transaktionen gefunden, die Ihren Suchkriterien entsprechen."
              : "Keine Transaktionen gefunden."}
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredTransactions.length > 0 && (
        <div className="mt-4 flex justify-between items-center">
          <div className={darkMode ? "text-gray-300" : "text-gray-600"}>
            Seite {currentPage} von {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${
                darkMode
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              } disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage >= totalPages}
              className={`p-2 rounded-md ${
                darkMode
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              } disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Receipt viewer */}
      {(imgUrl || pdfUrl) && (
        <div
          className={`mt-6 p-4 rounded-lg ${
            darkMode ? "bg-gray-700" : "bg-gray-100"
          }`}
        >
          <h3
            className={`text-lg font-medium mb-3 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Beleg
          </h3>
          {imgUrl && (
            <img
              src={imgUrl}
              alt="Beleg"
              className="max-w-full h-auto rounded-lg"
            />
          )}
          {pdfUrl && (
            <embed
              src={pdfUrl}
              type="application/pdf"
              width="100%"
              height="600px"
              className="rounded-lg"
            />
          )}
        </div>
      )}
    </div>
  );
}
