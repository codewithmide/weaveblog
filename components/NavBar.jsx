import Link from "next/link";
import { LuWallet2 } from "react-icons/lu";
import { useWallet } from "../hooks/useWallet";

export default function NavBar() {
  const { user, login, logout } = useWallet();

  return (
    <nav className="between w-full">
      <Link href="/">
        <p className="text-2xl font-bold cursor-pointer">WeaveBlog</p>
      </Link>

      <div>
        {user ? (
          <div className="bg-green-600 text-white px-8 py-3 rounded-lg center gap-4 font-bold">
            <LuWallet2 />
            <p onClick={logout} className="cursor-pointer">
              {user.wallet.slice(0, 7)}...
            </p>
          </div>
        ) : (
          <div className="bg-black text-white px-8 py-3 rounded-lg center gap-4 font-bold">
             <LuWallet2 />
            <p onClick={login} className="cursor-pointer">
              Connect Wallet
            </p>
          </div>
        )}
      </div>
    </nav>
  );
}
