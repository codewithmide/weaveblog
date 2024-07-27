import React from "react";
import { useRouter } from "next/router";

const BlogCard = ({ blog }) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/blogs/${blog.id}`);
  };

  return (
    <div
      className="w-full lg:h-[320px] p-0 center hover:opacity-90 duration-300 transition-all border-gray-700 rounded-lg border cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="w-full h-full center lg:flex-row flex-col-reverse">
      <div className="lg:w-[30%] w-full h-full center">
        {blog.data.image && (
            <img
              src={blog.data.image}
              alt="Blog Image"
              className="rounded-l-lg h-full object-cover"
            />
          )}
        </div>
        <div className="lg:w-[70%] w-full flex flex-col gap-4 md:px-14 md:py-10 lg:py-0 px-6 py-6">
          <div className="text-3xl leading-8 font-bold clash">
            {blog.data.title}
          </div>
          <div>{blog.data.content?.substring(0, 100)}...</div>
          <div className="mt-6 between flex-col md:flex-row md:gap-0 gap-6">
            <div className="flex gap-2 center">
              <p>{new Date(blog.data.date).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default BlogCard;
