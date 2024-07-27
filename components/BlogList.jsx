import BlogCard from "./BlogCard";

export default function BlogList({ blogs, onBlogSelect }) {
  return (
    <div>
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} onClick={() => onBlogSelect(blog)} />
      ))}
    </div>
  );
}