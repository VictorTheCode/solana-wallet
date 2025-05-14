import { useState } from "react";
import {
  ArrowRight,
  Wallet,
  CheckCircle,
  Loader,
  ExternalLink,
  Clock,
  Shield,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import { useSolanaWallet } from "../hooks/useSolanaWallet";
import { useTransaction } from "../hooks/useTransaction";
import type { TransactionPriority } from "../interfaces/transaction";

const SendSolForm = () => {
  // UI state
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [priority, setPriority] = useState<TransactionPriority>("normal");
  const [showRecentTx, setShowRecentTx] = useState(false);
  const [network, setNetwork] = useState("devnet");

  // Custom hooks for wallet and transaction functionality
  const {
    balance,
    walletAddress,
    formattedAddress,
    connected,
    isConnecting,
    connectWallet,
    disconnectWallet,
    recentTransactions,
    error: walletError,
    // setError: setWalletError,
  } = useSolanaWallet();

  const {
    sendSol,
    isSubmitting,
    isSuccess,
    txHash,
    error: txError,
    getFee,
    getTotal,
    resetTransactionState,
  } = useTransaction();

  // Merged error state from both hooks
  const error = txError || walletError;

  // Handle form submission
  const handleSubmit = async () => {
    if (!amount || !address || !connected) return;

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) return;

    const success = await sendSol({
      amount: parsedAmount,
      destinationAddress: address,
      priority,
    });

    if (success) {
      // Transaction was successful
      // The transaction state is managed by the useTransaction hook
    }
  };

  // Format wallet address for display (fallback if not provided by hook)
  const formatAddress = (addr: string) => {
    if (!addr) return "";
    return addr.slice(0, 4) + "..." + addr.slice(-4);
  };

  return (
    <div className="bg-gray-800 w-full max-w-md rounded-xl shadow-2xl overflow-hidden relative">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Send SOL</h2>
          {connected ? (
            <div className="flex flex-col items-end">
              <div className="flex items-center">
                <Wallet className="w-5 h-5 mr-2" />
                <span className="font-bold">{balance.toFixed(4)} SOL</span>
              </div>
              <span className="text-xs text-indigo-200 mt-1">
                Connected: {formattedAddress || formatAddress(walletAddress)}
              </span>
            </div>
          ) : (
            <div className="flex items-center">
              <span className="text-indigo-200 text-sm mr-2">
                Not connected
              </span>
              <Wallet className="w-5 h-5" />
            </div>
          )}
        </div>
        <div className="flex justify-between items-center mt-2">
          <p className="text-indigo-200">Fast & secure transactions</p>
          <div className="text-xs bg-indigo-800 bg-opacity-50 px-2 py-1 rounded">
            {network}
          </div>
        </div>
      </div>

      {/* Wallet Connection */}
      {!connected && (
        <div className="p-6 bg-gray-700 bg-opacity-30">
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-lg font-medium flex items-center justify-center text-white transition-all"
          >
            {isConnecting ? (
              <>
                <Loader className="w-5 h-5 animate-spin mr-2" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="w-5 h-5 mr-2" />
                Connect Wallet
              </>
            )}
          </button>

          {error && (
            <p className="text-red-400 text-xs mt-2 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {error}
            </p>
          )}
        </div>
      )}

      {/* Form Fields */}
      <div className="p-6 relative z-10">
        {isSuccess ? (
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-green-400 font-medium flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Transaction Sent!
              </h3>
              <div className="bg-green-500 bg-opacity-20 text-gray-200 text-xs font-medium px-2 py-1 rounded">
                Confirmed
              </div>
            </div>

            <div className="text-gray-300 text-sm mb-3">
              <div className="flex justify-between mb-1">
                <span className="text-gray-400">Amount:</span>
                <span>{amount} SOL</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-400">To:</span>
                <span className="truncate max-w-xs">
                  {formatAddress(address)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Transaction Hash:</span>
                <span className="truncate max-w-xs">
                  {txHash ? `${txHash.slice(0, 6)}...${txHash.slice(-4)}` : "—"}
                </span>
              </div>
            </div>

            <div className="flex space-x-2 mt-4">
              <a
                href={`https://explorer.solana.com/tx/${txHash}?cluster=${network}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center py-2 px-3 bg-gray-600 hover:bg-gray-500 text-white text-sm rounded-lg transition-colors flex-1"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                View on Explorer
              </a>
              <button
                onClick={() => {
                  resetTransactionState();
                  setAmount("");
                  setAddress("");
                }}
                className="flex items-center justify-center py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg transition-colors flex-1"
              >
                <ArrowRight className="w-4 h-4 mr-1" />
                New Transfer
              </button>
            </div>
          </div>
        ) : connected ? (
          <>
            <div className="mb-5">
              <label
                htmlFor="address"
                className="block text-gray-300 mb-2 font-medium"
              >
                Recipient Address
              </label>
              <div className="relative">
                <input
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter SOL wallet address"
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            <div className="mb-6">
              <label
                htmlFor="amount"
                className="block text-gray-300 mb-2 font-medium"
              >
                Amount (SOL)
              </label>
              <div className="relative">
                <input
                  id="amount"
                  type="text"
                  value={amount}
                  onChange={(e) => {
                    // Only allow numbers and decimal points
                    const value = e.target.value.replace(/[^0-9.]/g, "");
                    setAmount(value);
                  }}
                  placeholder="0.00"
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-300 font-semibold">
                  SOL
                </div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-400">
                <span>Available: {balance.toFixed(4)} SOL</span>
                <button
                  onClick={() => setAmount((balance - 0.01).toFixed(4))} // Leave small amount for fees
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  MAX
                </button>
              </div>
            </div>

            {/* Advanced Options */}
            <div className="mb-6">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center text-gray-400 hover:text-gray-300 text-sm mb-2"
              >
                <ChevronDown
                  className={`w-4 h-4 mr-1 transition-transform ${
                    showAdvanced ? "transform rotate-180" : ""
                  }`}
                />
                Advanced Options
              </button>

              {showAdvanced && (
                <div className="bg-gray-700 bg-opacity-50 rounded-lg p-3">
                  <div className="mb-3">
                    <label className="block text-gray-300 mb-2 text-sm">
                      Transaction Priority
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setPriority("low")}
                        className={`text-xs py-2 rounded-lg transition-all ${
                          priority === "low"
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                        }`}
                      >
                        Low Fee
                      </button>
                      <button
                        onClick={() => setPriority("normal")}
                        className={`text-xs py-2 rounded-lg transition-all ${
                          priority === "normal"
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                        }`}
                      >
                        Normal
                      </button>
                      <button
                        onClick={() => setPriority("high")}
                        className={`text-xs py-2 rounded-lg transition-all ${
                          priority === "high"
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                        }`}
                      >
                        Fast
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-gray-400">
                    <div className="flex justify-between mb-1">
                      <span>Network Fee:</span>
                      <span>{getFee(priority)} SOL</span>
                    </div>
                    <div className="flex justify-between font-medium text-gray-300">
                      <span>Total Amount:</span>
                      <span>{getTotal(amount, priority)} SOL</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <label className="block text-gray-300 text-sm">
                      Network
                    </label>
                    <select
                      value={network}
                      onChange={(e) => setNetwork(e.target.value)}
                      className="bg-gray-600 text-white text-xs rounded px-2 py-1"
                    >
                      <option value="mainnet-beta">Mainnet</option>
                      <option value="devnet">Devnet</option>
                      <option value="testnet">Testnet</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !amount || !address}
              className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-all duration-300 
                  ${
                    !amount || !address
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                  }`}
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-5 h-5 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  Send SOL <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>

            {error && (
              <p className="mt-2 text-red-400 text-xs flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {error}
              </p>
            )}

            {/* Disconnect button */}
            <div className="mt-4 flex justify-center">
              <button
                onClick={disconnectWallet}
                className="text-gray-400 hover:text-gray-300 text-xs"
              >
                Disconnect Wallet
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-6 text-gray-400">
            Connect your wallet to send SOL
          </div>
        )}

        {/* Recent Transactions */}
        {connected && (
          <div className="mt-6">
            <button
              onClick={() => setShowRecentTx(!showRecentTx)}
              className="flex items-center text-gray-400 hover:text-gray-300 text-sm"
            >
              <Clock className="w-4 h-4 mr-1" />
              Recent Transactions
              <ChevronDown
                className={`w-4 h-4 ml-1 transition-transform ${
                  showRecentTx ? "transform rotate-180" : ""
                }`}
              />
            </button>

            {showRecentTx && (
              <div className="mt-2 bg-gray-700 bg-opacity-50 rounded-lg overflow-hidden">
                {recentTransactions && recentTransactions.length > 0 ? (
                  recentTransactions.map((tx, i) => (
                    <a
                      key={i}
                      href={`https://explorer.solana.com/tx/${tx.signature}?cluster=${network}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 border-b border-gray-600 last:border-b-0 hover:bg-gray-700"
                    >
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-300 text-sm truncate">
                          {tx.address}
                        </span>
                        <span className="text-gray-300 font-medium">
                          {tx.amount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-400">{tx.time}</span>
                        <span className="text-xs text-green-400">
                          {tx.status}
                        </span>
                      </div>
                    </a>
                  ))
                ) : (
                  <div className="p-3 text-center text-gray-400 text-sm">
                    No recent transactions found
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Security Badge */}
        <div className="mt-6 flex items-center justify-center text-xs text-gray-400">
          <Shield className="w-3 h-3 mr-1" />
          End-to-end encrypted transaction
        </div>
      </div>

      {/* Background subtle effect */}
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-600 rounded-full filter blur-3xl opacity-10"></div>
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-600 rounded-full filter blur-3xl opacity-10"></div>
    </div>
  );
};

export default SendSolForm;
