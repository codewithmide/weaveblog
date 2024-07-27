import "@/styles/globals.css";
import { WalletProvider } from "@/context/walletProvider";

export default function App({ Component, pageProps }) {
  return (
    <WalletProvider>
      <Component {...pageProps} />
    </WalletProvider>
  );
}
