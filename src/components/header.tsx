import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 px-6 lg:px-20 py-4 flex justify-between items-center border-b border-gray-800 backdrop-blur-xl opacity-90 bg-gray-900">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
          SendSol
        </h1>
      </div>

      <WalletMultiButton />
    </header>
  );
};

export default Header;
