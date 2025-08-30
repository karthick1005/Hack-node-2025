"use client";
import { useState } from "react";

export function useTransaction() {
  const [transactionStatus, setTransactionStatus] = useState(null);

  const sendTransaction = async ({ amount = 50, to } = {}) => {
    try {
      // Simulate transaction processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate mock transaction hash
      const mockTxHash = '0x' + Math.random().toString(16).substr(2, 64);

      const result = {
        success: true,
        hash: mockTxHash,
        amount: amount,
        recipient: to || 'self',
        message: `Transaction of ${amount} completed successfully`
      };

      setTransactionStatus(result);
      return result;
    } catch (error) {
      const errorMessage = error.message || "Transaction failed";
      const result = {
        success: false,
        error: errorMessage,
      };

      setTransactionStatus(result);
      return result;
    }
  };

  return {
    sendTransaction,
    transactionStatus,
  };
}
