import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 px-6 py-4 flex justify-between items-center border-b border-gray-800 backdrop-blur-xl opacity-90 bg-gray-900">
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
      <WalletMultiButton />
    </header>
  );
};

export default Header;
