"use client"

import Link from "next/link";
import NavBar from "../components/NavBar";
import bg from "@/public/bg.png";
import { FaPlus } from "react-icons/fa6";
import { MdOutlineArrowOutward } from "react-icons/md";


export default function Home() {
  return (
    <main
      className="flex items-center flex-col w-screen min-h-screen px-24 py-10"
      style={{
        background: `url(${bg.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <NavBar />
      <div className="center flex-col my-auto">
        <h1 className="text-[5rem] font-bold">Welcome to WeaveBlog</h1>
        <h3 className="text-3xl">
          A decentralized blogging platform powered by WeaveDB
        </h3>
        <div className="center gap-4 mt-16">
          <Link href="/create" passHref>
            <div className="bg-[#A21CAF] font-bold text-white px-8 py-4 rounded-lg center gap-4 cursor-pointer">
              <FaPlus size={24}/>
              <p>Create a Blog</p>
            </div>
          </Link>
          <Link href="/my-blogs" passHref>
            <div className="bg-[#1D4ED8] font-bold text-white px-8 py-4 rounded-lg center gap-4 cursor-pointer">
              <MdOutlineArrowOutward size={24}/>
              <p>View My Blogs</p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
