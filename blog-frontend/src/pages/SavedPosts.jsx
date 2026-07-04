import { useEffect, useState } from "react";
import axios from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaEye, FaTrashAlt } from "react-icons/fa";

const SavedPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchSavedPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/posts/saved");
      setPosts(res.data);
    } catch (err) {
      toast.error("Failed to fetch saved posts");
    } finally {
      setLoading(false);
    }
  };

  const handleUnsavePost = async (postId) => {
    try {
      await axios.put(`/posts/${postId}/unsave`);
      toast.success("Post unsaved successfully");
      fetchSavedPosts();
    } catch (err) {
      toast.error("Failed to unsave post");
    }
  };

  useEffect(() => {
    fetchSavedPosts();
  }, []);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Saved Posts</h1>
      {loading ? (
        <p className="text-gray-500 text-center">Loading saved posts...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-500 text-center">No saved posts yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post._id} className="bg-white p-6 rounded-xl shadow-lg flex flex-col justify-between hover:shadow-2xl transition-shadow duration-300">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h2>
                <p className="text-sm text-gray-500 mb-4">By {post.author?.name || "Unknown"}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags?.length > 0 ? (
                    post.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-green-200 text-green-800">
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 italic text-sm">No tags</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors shadow-md"
                  onClick={() => navigate(`/post/${post._id}`)}
                >
                  <FaEye /> View
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-md"
                  onClick={() => handleUnsavePost(post._id)}
                >
                  <FaTrashAlt /> Unsave
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPosts;
