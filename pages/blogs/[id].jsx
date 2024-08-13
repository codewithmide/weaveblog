import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useWallet } from "../../hooks/useWallet";
import NavBar from "../../components/NavBar";
import bg from "@/public/bg.png";
import ReactMarkdown from "react-markdown";

const BlogDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const { db, user } = useWallet();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    if (db && id) {
      fetchBlog();
    }
  }, [db, id]);

  const fetchBlog = async () => {
    const fetchedBlog = await db.get("blogs", id);
    setBlog(fetchedBlog);
  };

  const handleEdit = () => {
    router.push({
      pathname: "/create",
      query: { id: id },
    });
  };

  //   console.log("Blog: ", blog)
  //   console.log("ID: ", id)

  const handleDelete = async () => {
    try {
      console.log(blog.id);
      await db.delete("blogs", id);
      router.push("/my-blogs");
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("An error occurred while deleting the blog.");
    }
  };

  if (!blog) {
    return (
      <div
        className="flex items-center flex-col justify-center w-screen min-h-screen px-24 py-10"
        style={{
          background: `url(${bg.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        Loading please wait...
      </div>
    );
  }

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
      <div className="w-full max-w-4xl mt-16">
        <h1 className="text-[3rem] font-bold">{blog.title}</h1>
        <div fontSize="sm" className="mt-6">
          <span style={{ fontWeight: "bold" }}>Author:</span> {blog.author}
        </div>
        <div fontSize="sm" className="my-2">
          <span style={{ fontWeight: "bold" }}>Date:</span>{" "}
          {new Date(parseInt(blog.date) * 1000).toLocaleString()}
        </div>
        {blog.modifiedDate && (
          <div fontSize="sm" className="mb-10">
            <span style={{ fontWeight: "bold" }}>Modified:</span>{" "}
            {new Date(parseInt(blog.modifiedDate) * 1000).toLocaleString()}
          </div>
        )}
        {blog.image && (
          <img
            src={blog.image}
            alt="Blog Image"
            className="w-full h-[400px] object-cover mb-4 rounded-lg"
          />
        )}
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline ? (
                <pre
                  style={{
                    background: "#f6f8fa",
                    padding: "15px",
                    borderRadius: "5px",
                    margin: "20px 0",
                    overflowX: "auto",
                  }}
                >
                  <code
                    className={className}
                    style={{ fontFamily: "monospace", fontSize: "14px" }}
                    {...props}
                  >
                    {children}
                  </code>
                </pre>
              ) : (
                <code
                  style={{
                    backgroundColor: "#f6f8fa",
                    padding: "3px 5px",
                    borderRadius: "3px",
                    fontFamily: "monospace",
                    fontSize: "14px",
                  }}
                >
                  {children}
                </code>
              );
            },
            a({ node, ...props }) {
              return (
                <a
                  style={{
                    color: "blue",
                    textDecoration: "underline",
                    fontSize: "18px",
                  }}
                  {...props}
                />
              );
            },
            p({ node, ...props }) {
              return (
                <p
                  style={{
                    textAlign: "left",
                    fontSize: "18px",
                    lineHeight: "1.6",
                    margin: "20px 0",
                  }}
                  {...props}
                />
              );
            },
            ul({ node, ...props }) {
              return (
                <ul
                  style={{
                    paddingLeft: "30px",
                    marginBottom: "20px",
                    listStyleType: "disc",
                  }}
                  {...props}
                />
              );
            },
            ol({ node, ...props }) {
              return (
                <ol
                  style={{
                    paddingLeft: "30px",
                    marginBottom: "20px",
                    listStyleType: "decimal",
                  }}
                  {...props}
                />
              );
            },
            li({ node, ...props }) {
              return (
                <li
                  style={{
                    marginBottom: "10px",
                    fontSize: "18px",
                    lineHeight: "1.6",
                    display: "list-item",
                  }}
                  {...props}
                />
              );
            },
            h1: ({ node, ...props }) => (
              <h1
                style={{
                  fontWeight: "bold",
                  fontSize: "2.5em",
                  marginBottom: "20px",
                  marginTop: "40px",
                  borderBottom: "1px solid #eaecef",
                  paddingBottom: "10px",
                }}
                {...props}
              />
            ),
            h2: ({ node, ...props }) => (
              <h2
                style={{
                  fontWeight: "bold",
                  fontSize: "2em",
                  marginBottom: "20px",
                  marginTop: "40px",
                  borderBottom: "1px solid #eaecef",
                  paddingBottom: "10px",
                }}
                {...props}
              />
            ),
            h3: ({ node, ...props }) => (
              <h3
                style={{
                  fontWeight: "bold",
                  fontSize: "1.5em",
                  marginBottom: "15px",
                  marginTop: "30px",
                }}
                {...props}
              />
            ),
            h4: ({ node, ...props }) => (
              <h4
                style={{
                  fontWeight: "bold",
                  fontSize: "1.25em",
                  marginBottom: "15px",
                  marginTop: "30px",
                }}
                {...props}
              />
            ),
            h5: ({ node, ...props }) => (
              <h5
                style={{
                  fontWeight: "bold",
                  fontSize: "1em",
                  marginBottom: "15px",
                  marginTop: "20px",
                }}
                {...props}
              />
            ),
            h6: ({ node, ...props }) => (
              <h6
                style={{
                  fontWeight: "bold",
                  fontSize: "0.875em",
                  marginBottom: "15px",
                  marginTop: "20px",
                  color: "#6a737d",
                }}
                {...props}
              />
            ),
            blockquote: ({ node, ...props }) => (
              <blockquote
                style={{
                  borderLeft: "4px solid #dfe2e5",
                  paddingLeft: "20px",
                  color: "#6a737d",
                  fontStyle: "italic",
                  margin: "20px 0",
                }}
                {...props}
              />
            ),
            table: ({ node, ...props }) => (
              <table
                style={{
                  borderCollapse: "collapse",
                  width: "100%",
                  marginBottom: "20px",
                }}
                {...props}
              />
            ),
            th: ({ node, ...props }) => (
              <th
                style={{
                  border: "1px solid #dfe2e5",
                  padding: "10px",
                  backgroundColor: "#f6f8fa",
                }}
                {...props}
              />
            ),
            td: ({ node, ...props }) => (
              <td
                style={{
                  border: "1px solid #dfe2e5",
                  padding: "10px",
                }}
                {...props}
              />
            ),
            img: ({ node, ...props }) => (
              <img
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  display: "block",
                  margin: "20px auto",
                }}
                {...props}
              />
            ),
            hr: ({ node, ...props }) => (
              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid #dfe2e5",
                  margin: "20px 0",
                }}
                {...props}
              />
            ),
          }}
        >
          {blog.content}
        </ReactMarkdown>
        <div className="flex justify-end mt-4 gap-4">
          <button
            onClick={handleEdit}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
