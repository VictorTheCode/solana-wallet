import Header from "./components/Header";
import { useWallet } from "@solana/wallet-adapter-react";
import SendSolForm from "./components/SendSolForm";

export default function App() {
  const { connected } = useWallet();
  return (
    <>
      {/* Header */}
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden">
        {/* Hero Section */}
        <section className="min-h-[100vh] flex items-center justify-center px-6 md:px-20 relative">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-1/4 w-72 h-72 bg-purple-600 rounded-full filter blur-3xl opacity-20"></div>
            <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-blue-600 rounded-full filter blur-3xl opacity-20"></div>
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold my-6">
              <span className="bg-gradient-to-r from-purple-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Welcome to SendSol
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">
              The next generation blockchain to send and receive SOL
            </p>

            {connected ? (
              <div className="flex items-center justify-center my-10 ">
                <SendSolForm />
              </div>
            ) : (
              <div className="flex flex-col md:flex-row justify-center gap-4">
                <p>Please connect your wallet to get started!</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
