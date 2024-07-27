import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import uploadImage from "@/utils/uploadImage";
import { useRouter } from "next/router";
import FileUpload from "./FileUpload";
import MarkdownIt from "markdown-it";

const MdEditor = dynamic(() => import("react-markdown-editor-lite"), {
  ssr: false,
});
import "react-markdown-editor-lite/lib/index.css";

export default function CreateBlogForm({
  db,
  user,
  initialBlog = id,
  onComplete,
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (initialBlog) {
      setTitle(initialBlog.data?.title);
      setContent(initialBlog.data?.content);
      setImageUrl(initialBlog.data?.image || "");
      setIsEditing(true);
    } else {
      setTitle("");
      setContent("");
      setImageUrl("");
      setIsEditing(false);
    }
  }, [initialBlog]);

  const handleEditorChange = ({ text }) => {
    setContent(text);
  };

  const handleFileChange = async (e) => {
    const file = e ? e.target.files[0] : null;
    setImage(file);

    if (file) {
      setIsUploading(true);
      try {
        const url = await uploadImage(file);
        setImageUrl(url);
        setImage(url);
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("An error occurred while uploading the image.");
      } finally {
        setIsUploading(false);
      }
    } else {
      setImageUrl("");
      setImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      alert("Title and content are required.");
      return;
    }

    setIsSubmitting(true);

    const currentTimestamp = Date.now();

    const blogData = {
      title: title,
      content: content,
      author: user.wallet,
      date: isEditing ? initialBlog.data.date : currentTimestamp,
      modifiedDate: currentTimestamp,
      image: imageUrl,
    };

    try {
      if (isEditing) {
        console.log("Updating blog:", blogData);
        await db.update(blogData, "blogs", id, user);
      } else {
        console.log("Creating new blog:", blogData);
        await db.add(blogData, "blogs", user);
      }

      if (onComplete) {
        onComplete();
      } else {
        router.push("/my-blogs");
      }
    } catch (error) {
      console.error("Error saving blog:", error);
      alert("An error occurred while saving the blog.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const mdParser = new MarkdownIt();

  return (
    <form onSubmit={handleSubmit} className="w-full center flex-col">
      <div className="flex items-end justify-end w-full">
        <button
          type="submit"
          className={`rounded-lg font-bold text-white px-8 py-4 relative ${
            isUploading || isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          }`}
          disabled={isUploading || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="opacity-0">
                {isEditing ? "Update Blog" : "Publish Blog"}
              </span>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
              </div>
            </>
          ) : isUploading ? (
            "Uploading Image Please wait..."
          ) : isEditing ? (
            "Update Blog"
          ) : (
            "Publish Blog"
          )}
        </button>
      </div>
      <div className="w-[80%] mt-10 flex items-start gap-6 flex-col">
        <div className="max-h-[400px] w-full">
          <FileUpload image={imageUrl} handleFileChange={handleFileChange} />
        </div>
        <input
          placeholder="Blog Title"
          className="w-full text-[3rem] font-bold text-gray-700 outline-none bg-transparent"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <MdEditor
          value={content}
          onChange={handleEditorChange}
          style={{
            height: 600,
            width: "100%",
          }}
          renderHTML={(text) => mdParser.render(text)}
        />
      </div>
    </form>
  );
}