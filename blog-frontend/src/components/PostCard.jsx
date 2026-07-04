import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  return (
    <div className="border p-4 rounded-lg shadow hover:shadow-lg transition">
      <h2 className="font-bold text-xl mb-2">{post.title}</h2>
      <p className="text-gray-700 line-clamp-4">{post.content}</p>
      <div className="mt-4 flex justify-between items-center">
        <Link
          to={`/post/${post._id}`}
          className="text-blue-500 hover:underline"
        >
          Read More
        </Link>
        <span className="text-sm text-gray-500">
          By {post.author?.name || "Unknown"}
        </span>
      </div>
    </div>
  );
};

export default PostCard;
