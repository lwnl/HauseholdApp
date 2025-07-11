import { fetchKontostand } from "../api/transactionApi";
import { useQuery } from "react-query";

export const useKassenbuch = () => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: "kontostand",
    queryFn: async () => {
      const [kontostand, incomeTotal, expenseTotal] = await Promise.all([
        fetchKontostand("both"),
        fetchKontostand("income"),
        fetchKontostand("expense"),
      ]);
      return { kontostand, incomeTotal, expenseTotal };
    },
    retry: 3, 
  });
  return {
    kontostand: data?.kontostand ?? 0,
    incomeTotal: data?.incomeTotal ?? 0,
    expenseTotal: data?.expenseTotal ?? 0,
    loading: isFetching,
    reloadData: refetch,
  };
};
