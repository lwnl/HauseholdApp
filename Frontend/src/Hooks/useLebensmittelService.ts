import { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Lebensmittel, Status, CreateLebensmittelData } from "../types";
import * as api from "../api/lebensmittelApi";
import { useToast } from "../context/ToastContext";
import { useWarnungen } from "./useWarnungen";
import { Warnung } from "../api/warnungenApi";
import debounce from 'lodash.debounce';
import deepEqual from 'fast-deep-equal';

export interface LebensmittelItem extends Omit<Lebensmittel, "status"> {
  id: string;
  name: string;
  quantity: number;
  expiryDate: string;
  category: string;
  status: Status;
  neu?: number;
  verbraucht?: number;
}
const emptyArray: Lebensmittel[] | undefined = [];
export const useLebensmittelService = () => {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { checkWarnings } = useWarnungen();

  // Base data fetching operations with reduced stale time
  const {
    data: rawLebensmittel = [],
    isLoading: loading  // 添加这行
  } = useQuery({
    queryKey: ["lebensmittel"],
    queryFn: api.fetchLebensmittel,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    // refetchInterval: 30 * 1000
  });

  console.log('rawLebensmittel:', rawLebensmittel)

  // Transform the data to match both interfaces
  const lebensmittel = useMemo(() => {
    return rawLebensmittel
      .filter(item => item.typ !== null)
      .map((item) => ({
        ...item, // Keep all original Lebensmittel properties
        id: item._id,
        name: item.typ.name,
        quantity: item.menge,
        expiryDate: item.expirationDate,
        category: item.typ.category,
        status: item.status as Status,
      }));
  }, [rawLebensmittel]);

  // Check for warnings whenever lebensmittel data changes
  const checkWarningsMemo = useCallback(async () => {
    const rawData = queryClient.getQueryData<Lebensmittel[]>(["lebensmittel"]) || [];

    const convertedData = rawData
    .filter(item => item.typ !== null)
    .map(item => ({
      ...item,
      id: item._id,
      name: item.typ.name,
      quantity: item.menge,
      expiryDate: item.expirationDate,
      category: item.typ.category,
      status: item.status as Status
    }));

    if (convertedData.length === 0) {
      queryClient.setQueryData(["warnungen"], []);
      return;
    }

    try {
      await checkWarnings(convertedData);
    } catch (error) {
      console.error("Fehler beim Prüfen der Warnungen", error);
    }
  }, [queryClient, checkWarnings]);

  useEffect(() => {
    const queryCache = queryClient.getQueryCache();

    // 1. 防抖处理（500ms间隔）
    const debouncedCheck = debounce(checkWarningsMemo, 500);

    // 2. 精确事件监听
    const handleCacheUpdate = (event: any) => {
      if (
        event?.query.queryKey[0] === "lebensmittel" &&
        event.type === "updated" && // 仅响应更新事件
        event.action.type === "success" // 仅处理成功响应
      ) {
        // 3. 数据变化对比
        const prevData = event.action.previousData ?? [];
        const currData = event.action.data ?? [];

        if (!deepEqual(prevData, currData)) {
          debouncedCheck();
        }
      }
    };

    const unsubscribe = queryCache.subscribe(handleCacheUpdate);

    // 4. 清理机制
    return () => {
      unsubscribe();
      debouncedCheck.cancel(); // 取消未执行的防抖调用
    };
  }, [queryClient, checkWarningsMemo]); // ✅ 稳定依赖

  // CRUD operations mutations
  const createMutation = useMutation({
    mutationFn: api.createLebensmittel,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lebensmittel"] });
      // checkWarningsMemo(); 
      showToast(`${data.typ.name} wurde erfolgreich hinzugefügt`, "success");
      setError(null);
    },
    onError: (error: Error) => {
      showToast(error.message, "error");
      setError(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Lebensmittel> }) =>
      api.updateLebensmittel(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lebensmittel"] });
      // checkWarningsMemo(); 
      showToast(`${data.typ.name} wurde erfolgreich aktualisiert`, "success");
      setError(null);
    },
    onError: (error: Error) => {
      showToast(error.message, "error");
      setError(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteLebensmittel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lebensmittel"] });
      // checkWarningsMemo(); 
      showToast("Artikel wurde erfolgreich gelöscht", "success");
      setError(null);
    },
    onError: (error: Error) => {
      showToast(error.message, "error");
      setError(error.message);
    },
  });

  const createLebensmittel = async (data: CreateLebensmittelData) => {
    try {
      await createMutation.mutateAsync(data);
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  };

  const updateLebensmittel = async (
    id: string,
    data: Partial<Lebensmittel>
  ) => {
    try {
      await updateMutation.mutateAsync({ id, data });
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  };

  const deleteLebensmittel = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  };

  return {
    lebensmittel,
    lebensmittelTypen: rawLebensmittel.map((l) => l.typ),
    loading,
    error,
    createLebensmittel,
    updateLebensmittel,
    deleteLebensmittel,
  };
};
