import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import { ArrowRight } from "lucide-react";
import type { FC } from "react";

const PROGRAM_ID = `ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa`;
const DATA_ACCOUNT_KEY = `Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod`;

const Ping: FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const onClick = async () => {
    if (!publicKey || !connection) {
      console.error("Wallet not connected or connection not available");
      return;
    }

    try {
      //

      const programId = new web3.PublicKey(PROGRAM_ID);
      const dataAccount = new web3.PublicKey(DATA_ACCOUNT_KEY);
      const transaction = new web3.Transaction();

      const instruction = new web3.TransactionInstruction({
        keys: [
          {
            pubkey: dataAccount,
            isSigner: false,
            isWritable: true,
          },
        ],
        programId,
      });

      transaction.add(instruction);

      const signature = await sendTransaction(transaction, connection);
      console.log(`Transaction Signature: ${signature}`);
    } catch (error) {
      console.error("Error sending transaction:", error);
    }
  };
  return (
    <div className="flex flex-col md:flex-row justify-center gap-4">
      <button
        onClick={onClick}
        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition shadow-lg flex items-center justify-center"
      >
        Ping!
        <ArrowRight size={18} className="ml-2" />
      </button>
    </div>
  );
};

export default Ping;
