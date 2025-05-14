import { useEffect, useState, useCallback } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import type { Transaction } from "../interfaces/transaction";

export const useSolanaWallet = () => {
  const { connection } = useConnection();
  const { publicKey, connected, connecting, disconnect } = useWallet();
  const { select, wallets } = useWallet();

  const [balance, setBalance] = useState<number>(0);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Memoize the function instead more efficient than useEffect
  const retrieveAccountInfo = useCallback(async () => {
    if (!publicKey || !connection) return;

    try {
      setIsRefreshing(true);

      // Get the Balance of SOL
      const balanceInLamports = await connection.getBalance(publicKey);
      const solBalance = balanceInLamports / LAMPORTS_PER_SOL;
      setBalance(solBalance);
      setError(null);
    } catch (err) {
      console.error("Error fetching balance:", err);
      setError(
        err instanceof Error ? err.message : "Failed to retrieve account info"
      );
    } finally {
      setIsRefreshing(false);
    }
  }, [publicKey, connection]);

  // Fetch the recent transactions
  const fetchRecentTransactions = useCallback(async () => {
    if (!publicKey || !connection) return;

    try {
      setIsRefreshing(true);

      // Get recent transactions (last 5)
      const signatures = await connection.getSignaturesForAddress(publicKey, {
        limit: 5,
      });

      // Format transaction data
      const txs = signatures.map((sig) => ({
        signature: sig.signature,
        address: sig.signature.slice(0, 4) + ".." + sig.signature.slice(-4),
        time: new Date((sig.blockTime ?? 0) * 1000).toLocaleString(),
        status: sig.confirmationStatus || "confirmed",
        amount: "-", // Would need additional API calls to get amounts
      }));

      setRecentTransactions(txs);
      setError(null);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch recent transactions"
      );
    } finally {
      setIsRefreshing(false);
    }
  }, [publicKey, connection]);

  // Connect to wallet
  const connectWallet = useCallback(async () => {
    try {
      // If there's only one wallet available, connect to it
      if (wallets.length === 1) {
        select(wallets[0].adapter.name);
      } else if (wallets.length > 1) {
        // If multiple wallets available, connect to the first available one
        // This can be improved to add wallet selection logic
        select(wallets[0].adapter.name);
      }
    } catch (err) {
      console.error("Error connecting to wallet:", err);
      setError(err instanceof Error ? err.message : "Failed to connect wallet");
    }
  }, [wallets, select]);

  // Update account info when connection or public key changes
  useEffect(() => {
    if (connection && publicKey) {
      retrieveAccountInfo();
      fetchRecentTransactions();
    }
  }, [connection, publicKey, retrieveAccountInfo, fetchRecentTransactions]);

  // Format wallet address for display
  const formatAddress = (address?: string): string => {
    if (!address) return "";
    return address.slice(0, 4) + "..." + address.slice(-4);
  };

  // Refresh wallet data
  const refreshWalletData = async () => {
    await retrieveAccountInfo();
    await fetchRecentTransactions();
  };

  return {
    connection,
    walletAddress: publicKey?.toBase58() || "",
    formattedAddress: formatAddress(publicKey?.toBase58()),
    isConnecting: connecting,
    connectWallet,
    disconnectWallet: disconnect,
    balance,
    publicKey,
    error,
    connected,
    isRefreshing,
    recentTransactions,
    refreshWalletData,
    setError,
  };
};
