import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { FaEdit, FaTrashAlt, FaSave, FaTimes } from "react-icons/fa";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const { user } = useAuth();
  
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/admin/posts");
      setPosts(res.data);
    } catch (error) {
      toast.error("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const res = await axios.get("/admin/tags");
      setTags(res.data);
    } catch (error) {
      toast.error("Failed to fetch tags");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`/admin/posts/${id}`);
      toast.success("Post deleted successfully");
      fetchPosts();
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };

  const handleEditTags = (post) => {
    setEditingPostId(post._id);
    setSelectedTags(post.tags || []);
  };
  const handleSaveTags = async (postId) => {
    try {
      await axios.put(`/admin/posts/${postId}/tags`, { tags: selectedTags });
      toast.success("Tags updated successfully");
      setEditingPostId(null);
      setSelectedTags([]);
      fetchPosts();
    } catch (error) {
      toast.error("Failed to update tags");
    }
  };

  const toggleTag = (tagName) => {
    setSelectedTags((prev) =>
      prev.includes(tagName)
        ? prev.filter((t) => t !== tagName)
        : [...prev, tagName]
    );
  };
  
  useEffect(() => {
    fetchPosts();
    fetchTags();
  }, []);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">All Posts</h1>
      {loading ? (
        <p className="text-gray-500 text-center">Loading posts...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="min-w-full table-auto text-gray-800">
            <thead className="bg-gray-200 border-b-2 border-gray-300">
              <tr>
                <th className="p-4 text-left">Title</th>
                <th className="p-4 text-left hidden md:table-cell">Author</th>
                <th className="p-4 text-left hidden sm:table-cell">Tags</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <tr key={post._id} className="border-t border-gray-200 hover:bg-gray-100 transition-colors">
                    <td className="p-4">{post.title}</td>
                    <td className="p-4 hidden md:table-cell">{post.author?.name || "Unknown"}</td>
                    <td className="p-4 hidden sm:table-cell">
                      {editingPostId === post._id ? (
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag) => (
                            <span
                              key={tag._id}
                              onClick={() => toggleTag(tag.name)}
                              className={`px-3 py-1 rounded-full cursor-pointer text-sm font-medium transition-colors ${
                                selectedTags.includes(tag.name)
                                  ? "bg-green-600 text-white"
                                  : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                              }`}
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {post.tags?.length > 0 ? (
                            post.tags.map((tag) => (
                              <span key={tag} className="px-3 py-1 rounded-full text-sm font-medium bg-gray-300 text-gray-700">
                                {tag}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500 italic">No tags</span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {editingPostId === post._id ? (
                        <div className="flex justify-center gap-2">
                          <button
                            className="text-white px-3 py-1 rounded-full transition-colors bg-green-600 hover:bg-green-700"
                            onClick={() => handleSaveTags(post._id)}
                            title="Save Tags"
                          >
                            <FaSave />
                          </button>
                          <button
                            className="text-white px-3 py-1 rounded-full transition-colors bg-gray-500 hover:bg-gray-600"
                            onClick={() => setEditingPostId(null)}
                            title="Cancel"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-center gap-2">
                          <button
                            className="text-white px-3 py-1 rounded-full transition-colors bg-blue-600 hover:bg-blue-700"
                            onClick={() => handleEditTags(post)}
                            title="Edit Tags"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="text-white px-3 py-1 rounded-full transition-colors bg-red-600 hover:bg-red-700"
                            onClick={() => handleDelete(post._id)}
                            title="Delete Post"
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    No posts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Posts;