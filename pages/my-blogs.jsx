"use client"

import { useState, useEffect } from "react";
import BlogCard from "../components/BlogCard";
import { useWallet } from "../hooks/useWallet";
import NavBar from "../components/NavBar";
import bg from "@/public/bg.png";

export default function MyBlogs() {
  const { db, user } = useWallet();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    if (db && user) {
      getBlogs();
    }
  }, [db, user]);

  const getBlogs = async () => {
    const fetchedBlogs = await db.cget("blogs", ["date", "desc"]);
    setBlogs(fetchedBlogs);
  };

  // console.log("Blogs", blogs)

  return (
    <div
      className="flex items-center flex-col w-screen min-h-screen px-24 py-10"
      style={{
        background: `url(${bg.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <NavBar />
      {user ? (
        <div className="mt-10 w-full">
          <h1 className="text-[3rem] font-bold text-gray-700 mb-6 text-left w-full">My Blogs</h1>
          <div className="w-full flex flex-wrap gap-6">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        </div>
      ) : (
        <div className="my-auto">Please connect your wallet to view your blogs.</div>
      )}
    </div>
  );
}
