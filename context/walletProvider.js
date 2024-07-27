import { useState, useEffect, useCallback } from "react";
import lf from "localforage";
import { isNil } from "ramda";
import SDK from "weavedb-sdk";
import { ethers } from "ethers";
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
    checkLoggedInUser();
  }, [setupWeaveDB]);

  const checkLoggedInUser = async () => {
    try {
      const currentWallet = await lf.getItem("temp_address:current");
      if (currentWallet) {
        const identity = await lf.getItem(`temp_address:${contractTxId}:${currentWallet}`);
        if (identity) {
          setUser({
            wallet: currentWallet,
            privateKey: identity.privateKey,
          });
        }
      }
    } catch (error) {
      console.error("Error checking logged-in user:", error);
    }
  };

  const login = async () => {
    if (!isDbReady) {
      alert("Database is not ready yet. Please try again in a moment.");
      return;
    }

    try {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        await provider.send("eth_requestAccounts", []);
        const wallet_address = await provider.getSigner().getAddress();
        let identity = await lf.getItem(
          `temp_address:${contractTxId}:${wallet_address}`
        );
        let tx;
        let err;
        if (isNil(identity)) {
          ({ tx, identity, err } = await db.createTempAddress(wallet_address));
          const linked = await db.getAddressLink(identity.address);
          if (isNil(linked)) {
            alert("Something went wrong with address linking");
            return;
          }
        } else {
          await lf.setItem("temp_address:current", wallet_address);
          setUser({
            wallet: wallet_address,
            privateKey: identity.privateKey,
          });
          return;
        }
        if (!isNil(tx) && isNil(tx.err)) {
          identity.tx = tx;
          identity.linked_address = wallet_address;
          await lf.setItem("temp_address:current", wallet_address);
          await lf.setItem(
            `temp_address:${contractTxId}:${wallet_address}`,
            JSON.parse(JSON.stringify(identity))
          );
          setUser({
            wallet: wallet_address,
            privateKey: identity.privateKey,
          });
        } else if (err) {
          console.error("Error in createTempAddress:", err);
          alert("An error occurred while creating a temporary address. Please try again.");
        }
      } else {
        alert("Please install MetaMask or another Ethereum wallet provider.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login. Please try again.");
    }
  };

  const logout = async () => {
    try {
      if (confirm("Would you like to sign out?")) {
        await lf.removeItem("temp_address:current");
        setUser(null);
        console.log("User logged out");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    if (!user && !isDbReady) {
      setupWeaveDB();
    }
  }, [user, isDbReady, setupWeaveDB]);

  return (
    <WalletContext.Provider value={{ db, user, login, logout, isDbReady }}>
      {children}
    </WalletContext.Provider>
  );
}