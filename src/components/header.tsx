import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const Header = () => {
  return (
    <header className="px-6 py-4 flex justify-between items-center border-b border-gray-800">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
          track.sol
        </h1>
      </div>
      <nav className="hidden md:flex space-x-8 mx-auto">
        <a
          href="#features"
          className="text-gray-300 hover:text-white transition"
        >
          Features
        </a>
        <a
          href="#ecosystem"
          className="text-gray-300 hover:text-white transition"
        >
          Ecosystem
        </a>
        <a
          href="#developers"
          className="text-gray-300 hover:text-white transition"
        >
          Developers
        </a>
        <a
          href="#community"
          className="text-gray-300 hover:text-white transition"
        >
          Community
        </a>
      </nav>
      {/* <button
        // onClick={handleConnectWallet}
        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center space-x-2 hover:from-purple-700 hover:to-blue-700 transition shadow-lg"
      >
        <Wallet size={18} />
        <span>{"Connect Wallet"}</span>
      </button> */}
      <WalletMultiButton />
    </header>
  );
};

export default Header;
