"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import CreateBlogForm from "../components/CreateBlogForm";
import { useWallet } from "../hooks/useWallet";
import bg from "@/public/bg.png";
import NavBar from "../components/NavBar";

export default function CreateEditBlog() {
  const { db, user } = useWallet();
  const [initialBlog, setInitialBlog] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id && db) {
      console.log({ db, user });
      fetchBlog();
    } else {
      setInitialBlog(null);
    }
  }, [id, db]);

  // console.log("ID: ", id)

  const fetchBlog = async () => {
    try {
      const blog = await db.get("blogs", id);
      setInitialBlog({ id, data: blog });
    } catch (error) {
      console.error("Error fetching blog:", error);
      alert("Failed to fetch the blog for editing.");
    }
  };

  const handleComplete = () => {
    router.push("/my-blogs");
  };

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
      {user ? (
        <div className="center flex-col gap-6 w-full">
          <CreateBlogForm
            db={db}
            user={user}
            initialBlog={initialBlog}
            onComplete={handleComplete}
          />
        </div>
      ) : (
        <>
          <NavBar />
          <div className="my-auto">
            Please connect your wallet to create or edit a blog post.
          </div>
        </>
      )}
    </div>
  );
}
