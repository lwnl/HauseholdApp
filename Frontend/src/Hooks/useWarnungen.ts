import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchWarnungen,
  createWarnung,
  deleteWarnung,
  resolveWarnung,
  checkAndCreateWarnings,
} from "../api/warnungenApi";
import type { Warnung } from "../api/warnungenApi";
import { useToast } from "../context/ToastContext";
import { useCallback } from "react";

export const useWarnungen = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { data: warnungen = [], isLoading: loading } = useQuery({
    queryKey: ["warnungen"],
    queryFn: fetchWarnungen,
  });

  const createMutation = useMutation({
    mutationFn: (data: {
      text: string;
      type?: Warnung["type"];
      priority?: Warnung["priority"];
      relatedItemId?: string;
    }) =>
      createWarnung(data.text, data.type, data.priority, data.relatedItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warnungen"] });
      showToast("Warnung wurde erstellt", "success");
    },
    onError: (error: Error) => {
      showToast(error.message, "error");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteWarnung,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warnungen"] });
      showToast("Warnung wurde gelöscht", "success");
    },
    onError: (error: Error) => {
      showToast(error.message, "error");
    },
  });

  const resolveMutation = useMutation({
    mutationFn: resolveWarnung,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warnungen"] });
      showToast("Warnung wurde als erledigt markiert", "success");
    },
    onError: (error: Error) => {
      showToast(error.message, "error");
    },
  });

  const checkWarnings = useCallback(async (
    lebensmittel: {
      id: string;
      name: string;
      quantity: number;
      expiryDate: string;
    }[]
  ) => {
    try {
      await checkAndCreateWarnings(lebensmittel);
      queryClient.invalidateQueries({ queryKey: ["warnungen"] });
    } catch {
      showToast("Fehler beim Prüfen der Warnungen", "error");
    }
  }, [checkAndCreateWarnings, queryClient, showToast]) ;

  return {
    warnungen,
    loading,
    createWarnung: createMutation.mutate,
    deleteWarnung: deleteMutation.mutate,
    resolveWarnung: resolveMutation.mutate,
    checkWarnings,
  };
};
