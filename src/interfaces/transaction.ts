import type { Connection } from "@solana/web3.js";
export type TransactionPriority = "low" | "normal" | "high";

export interface Transaction {
  signature: string;
  address: string;
  time: string;
  status: string;
  amount: string;
}

export interface Provider {
  connection: Connection;
  publicKey: string;
  // sendTransaction: (transaction: any, connection: any) => Promise<string>;
}

export interface TransactionProps {
  amount: number;
  destinationAddress: string;
  priority?: TransactionPriority;
  callback?: () => void;
}
