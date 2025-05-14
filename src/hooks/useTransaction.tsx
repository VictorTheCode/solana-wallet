import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  PublicKey,
  Transaction,
  SystemProgram,
  ComputeBudgetProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import type {
  TransactionPriority,
  TransactionProps,
} from "../interfaces/transaction";

export const useTransaction = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Calculate transaction fee based on priority
  const getFee = (priority: TransactionPriority = "normal") => {
    const baseFee = 0.000005; // Base transaction fee in SOL
    const priorityMultipliers = {
      low: 0.5,
      normal: 1,
      high: 2,
    };

    return (baseFee * priorityMultipliers[priority]).toFixed(6);
  };

  // Calculate total with fee
  const getTotal = (
    amount: string,
    priority: TransactionPriority = "normal"
  ) => {
    if (!amount) return "0";
    return (parseFloat(amount) + parseFloat(getFee(priority))).toFixed(6);
  };

  // Get priority fee in micro-lamports
  const getPriorityFee = (priority: TransactionPriority = "normal"): number => {
    const priorityFees = {
      low: 10000,
      normal: 50000,
      high: 100000,
    };

    return priorityFees[priority];
  };

  // Send SOL transaction
  const sendSol = async ({
    amount,
    destinationAddress,
    priority = "normal",
    callback,
  }: TransactionProps) => {
    if (!amount || !destinationAddress || !publicKey || !connection) {
      setError("Missing required parameters for transaction");
      return false;
    }

    setIsSubmitting(true);
    setError(null);
    setIsSuccess(false);

    try {
      // Parse the amount to lamports (1 SOL = 1,000,000,000 lamports)
      const lamports = amount * LAMPORTS_PER_SOL;

      // Create a new destination public key
      const toPublicKey = new PublicKey(destinationAddress);

      // Create a new transaction
      const transaction = new Transaction();

      // Add the transfer instruction
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: toPublicKey,
          lamports,
        })
      );

      // Add priority fee instruction if specified
      if (priority) {
        transaction.add(
          ComputeBudgetProgram.setComputeUnitPrice({
            microLamports: getPriorityFee(priority),
          })
        );
      }

      // Set recent blockhash and fee payer
      transaction.feePayer = publicKey;
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;

      // Send the transaction
      const signature = await sendTransaction(transaction, connection);

      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(
        signature,
        "confirmed"
      );

      if (confirmation.value.err) {
        throw new Error("Transaction failed to confirm");
      }

      // Update state with success
      setTxHash(signature);
      setIsSuccess(true);

      // Execute callback if provided
      if (callback) {
        callback();
      }

      return true;
    } catch (err) {
      console.error("Transaction error:", err);
      setError(err instanceof Error ? err.message : "Transaction failed");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset transaction state
  const resetTransactionState = () => {
    setIsSuccess(false);
    setTxHash("");
    setError(null);
  };

  return {
    sendSol,
    isSubmitting,
    isSuccess,
    txHash,
    error,
    getFee,
    getTotal,
    resetTransactionState,
  };
};
