import React from "react";
import Link from "next/link";
import { LuWallet2 } from "react-icons/lu";
import { useWallet } from "../hooks/useWallet";

export default function NavBar() {
  const { user, login, logout, isDbReady } = useWallet();

  const handleWalletAction = async () => {
    if (user) {
      await logout();
    } else {
      if (isDbReady) {
        try {
          await login();
        } catch (error) {
          console.error("Login failed:", error);
          alert(error.message || "Login failed. Please try again.");
        }
      } else {
        alert("Please wait, the database is initializing.");
      }
    }
  };

  return (
    <nav className="between w-full">
      <Link href="/">
        <p className="text-2xl font-bold cursor-pointer">WeaveBlog</p>
      </Link>

      <div>
        <div 
          className={`${user ? 'bg-green-600' : 'bg-black'} text-white px-8 py-3 rounded-lg center gap-4 font-bold cursor-pointer`}
          onClick={handleWalletAction}
        >
          <LuWallet2 />
          <p>
            {user ? `${user.wallet.slice(0, 7)}...` : "Connect Wallet"}
          </p>
        </div>
      </div>
    </nav>
  );
}