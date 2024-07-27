import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";

export default function BlogDetailsModal({ blog, onClose, onDelete, db, user }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        await db.delete("bloga", blog.id, user);
        onDelete();
        onClose();
      } catch (error) {
        console.error("Failed to delete the blog:", error);
      }
    }
  };

  const handleEdit = () => {
    router.push(`/create?id=${blog.id}`);
    onClose();
  };

  return (
    <div isOpen={true} onClose={onClose} size="xl">
      <div>
        <h2>{blog.data.title}</h2>
        <div>
          <p>
            Author: {blog.data.author}
          </p>
          <p>
            Date: {new Date(parseInt(blog.data.date) * 1000).toLocaleString()}
          </p>
          <div>
            <ReactMarkdown>{blog.data.content}</ReactMarkdown>
          </div>
        </div>
        <div>
          <button onClick={handleEdit}>
            Edit
          </button>
          <button onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}