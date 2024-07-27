import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import SDK from "weavedb-sdk";
import { contractTxId } from "@/utils/constants";
import WalletContext from "./walletContext";

export const WalletProvider = ({ children }) => {
  const [db, setDb] = useState(null);
  const [user, setUser] = useState(null);
  const [isDbReady, setIsDbReady] = useState(false);

  const setupWeaveDB = useCallback(async () => {
    try {
      const _db = new SDK({ contractTxId });
      await _db.init();
      setDb(_db);
      setIsDbReady(true);
      console.log("WeaveDB initialized");
    } catch (error) {
      console.error("Error initializing WeaveDB:", error);
      setIsDbReady(false);
    }
  }, []);

  useEffect(() => {
    setupWeaveDB();
  }, [setupWeaveDB]);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        
        console.log("Wallet connected:", address);
        setUser({ wallet: address });
        
        return address;
      } catch (error) {
        console.error("Error connecting wallet:", error);
        throw error;
      }
    } else {
      const error = new Error("Ethereum wallet is not available");
      console.error(error);
      throw error;
    }
  };

  const login = async () => {
    try {
      if (!isDbReady) {
        throw new Error("Database is not ready yet. Please try again in a moment.");
      }
      
      const address = await connectWallet();
      
      // Here you can add logic to interact with WeaveDB if needed
      // For example, creating or fetching a user profile
      
      console.log("Login successful for address:", address);
    } catch (error) {
      console.error("Login error:", error);
      alert(error.message || "An error occurred during login. Please try again.");
    }
  };

  const logout = async () => {
    try {
      if (confirm("Would you like to sign out?")) {
        setUser(null);
        console.log("User logged out");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <WalletContext.Provider value={{ db, user, login, logout, isDbReady }}>
      {children}
    </WalletContext.Provider>
  );
};