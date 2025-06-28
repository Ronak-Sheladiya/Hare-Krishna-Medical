import { useState, useCallback } from "react";
import invoiceService from "../services/InvoiceService";

/**
 * Custom hook for invoice operations
 * Provides centralized state management for invoice actions
 */
export const useInvoice = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const printInvoice = useCallback(async (invoice) => {
    setLoading(true);
    setError(null);
    try {
      const result = await invoiceService.printInvoice(invoice);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, []);

  const downloadInvoice = useCallback(async (invoice) => {
    setLoading(true);
    setError(null);
    try {
      const result = await invoiceService.downloadInvoice(invoice);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, []);

  const viewInvoice = useCallback((invoice) => {
    setError(null);
    try {
      const result = invoiceService.viewInvoice(invoice);
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, []);

  const generateQR = useCallback(async (invoiceId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await invoiceService.generateInvoiceQR(invoiceId);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return null;
    }
  }, []);

  return {
    printInvoice,
    downloadInvoice,
    viewInvoice,
    generateQR,
    loading,
    error,
    clearError: () => setError(null),
  };
};

export default useInvoice;
