import Comment from "../components/Comment";
import { useState, useEffect } from "react";
import axios from "../api/axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const PostDetailComments = ({ postId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/comments/post/${postId}`);
      setComments(res.data);
    } catch (error) {
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return toast.error("Comment cannot be empty");
    try {
      await axios.post(`/comments/post/${postId}`, { content: newComment });
      toast.success("Comment added");
      setNewComment("");
      fetchComments();
    } catch (error) {
      toast.error("Failed to add comment");
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <div className="mt-8 p-6 bg-gray-950 rounded-xl shadow-2xl border border-gray-800">
      <h2 className="text-2xl font-bold text-gray-200 mb-4 border-b-2 pb-2 border-gray-800">
        Comments
      </h2>
      
      {user ? (
        <div className="flex flex-col md:flex-row gap-2 mb-6 p-4 bg-gray-900 rounded-lg shadow-inner border border-gray-800">
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="border-none bg-gray-800 text-gray-200 p-3 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all placeholder-gray-400"
          />
          <button
            onClick={handleAddComment}
            className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-sky-600 hover:to-blue-700 transition-colors"
          >
            Post
          </button>
        </div>
      ) : (
        <p className="text-gray-400 mb-6">You must be logged in to comment.</p>
      )}

      {loading ? (
        <p className="text-center text-gray-400">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-400">No comments yet. Be the first to comment!</p>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <Comment
              key={c._id}
              comment={c}
              onCommentUpdate={fetchComments}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostDetailComments;
