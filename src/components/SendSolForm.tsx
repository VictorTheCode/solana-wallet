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
} from "lucide-react";

const SendSolForm = () => {
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [priority, setPriority] = useState("normal");
  const [showRecentTx, setShowRecentTx] = useState(false);
  const [balance, setBalance] = useState("14.253");

  // Mock recent transactions
  const recentTransactions = [
    {
      address: "8xhT..9Yka",
      amount: "0.5",
      time: "2 hrs ago",
      status: "completed",
    },
    {
      address: "3zFr..7Bpq",
      amount: "1.2",
      time: "1 day ago",
      status: "completed",
    },
  ];

  // Mock transaction send function
  const handleSubmit = (e: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!amount || !address) return;

    setIsSubmitting(true);

    // Simulate transaction processing
    setTimeout(() => {
      // Generate a mock transaction hash
      const mockTxHash =
        "4xPG9iTu8UzHzFECzHxnKmo4LdVSW2CC2YarZcP3YgVCwMJNUcXlmXQAYvg2fKJt";
      setTxHash(mockTxHash);

      setIsSubmitting(false);
      setIsSuccess(true);

      // Update mock balance
      setBalance((parseFloat(balance) - parseFloat(amount)).toFixed(3));

      // Reset form after viewing
      setTimeout(() => {
        setIsSuccess(false);
        setAmount("");
        setAddress("");
      }, 10000);
    }, 2000);
  };

  // Calculate transaction fee based on priority
  const getFee = () => {
    switch (priority) {
      case "high":
        return "0.000010";
      case "normal":
        return "0.000005";
      case "low":
        return "0.000001";
      default:
        return "0.000005";
    }
  };

  // Calculate total with fee
  const getTotal = () => {
    if (!amount) return "0";
    return (parseFloat(amount) + parseFloat(getFee())).toFixed(6);
  };

  return (
    <div className="bg-gray-800 w-full max-w-md rounded-xl shadow-2xl overflow-hidden relative">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Send SOL</h2>
          <div className="flex flex-col items-end">
            <div className="flex items-center">
              <Wallet className="w-5 h-5 mr-2" />
              <span className="font-bold">{balance} SOL</span>
            </div>
            <span className="text-xs text-indigo-200 mt-1">
              Connected: Phan...5Gxz
            </span>
          </div>
        </div>
        <p className="text-indigo-200 mt-1">Fast & secure transactions</p>
      </div>

      {/* Form Fields */}
      <div className="p-6 relative z-10">
        {isSuccess ? (
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-green-400 font-medium flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Transaction Sent!
              </h3>
              <div className="bg-green-500 bg-opacity-20 text-green-400 text-xs font-medium px-2 py-1 rounded">
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
                <span className="truncate max-w-xs">{address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Transaction Hash:</span>
                <span className="truncate max-w-xs">
                  {txHash.slice(0, 10)}...{txHash.slice(-4)}
                </span>
              </div>
            </div>

            <div className="flex space-x-2 mt-4">
              <a
                href={`https://explorer.solana.com/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center py-2 px-3 bg-gray-600 hover:bg-gray-500 text-white text-sm rounded-lg transition-colors flex-1"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                View on Explorer
              </a>
              <button
                onClick={() => {
                  setIsSuccess(false);
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
        ) : (
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
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-300 font-semibold">
                  SOL
                </div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-400">
                <span>Available: {balance} SOL</span>
                <button
                  onClick={() => setAmount(balance)}
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
                <div className="bg-gray-700 bg-opacity-50 rounded-lg p-3 animate-fade-in">
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
                      <span>{getFee()} SOL</span>
                    </div>
                    <div className="flex justify-between font-medium text-gray-300">
                      <span>Total Amount:</span>
                      <span>{getTotal()} SOL</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
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
          </>
        )}

        {/* Recent Transactions */}
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
            <div className="mt-2 bg-gray-700 bg-opacity-50 rounded-lg overflow-hidden animate-fade-in">
              {recentTransactions.map((tx, i) => (
                <div
                  key={i}
                  className="p-3 border-b border-gray-600 last:border-b-0"
                >
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-300 text-sm truncate">
                      {tx.address}
                    </span>
                    <span className="text-gray-300 font-medium">
                      {tx.amount} SOL
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-400">{tx.time}</span>
                    <span className="text-xs text-green-400">{tx.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Security Badge */}
        <div className="mt-6 flex items-center justify-center text-xs text-gray-400">
          <Shield className="w-3 h-3 mr-1" />
          End-to-end encrypted transaction
        </div>
      </div>

      {/* Background glow effects */}
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-600 rounded-full filter blur-3xl opacity-10"></div>
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-600 rounded-full filter blur-3xl opacity-10"></div>
    </div>
  );
};

export default SendSolForm;
