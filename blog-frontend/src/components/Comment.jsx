import { useState } from "react";
import axios from "../api/axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { FaEdit, FaTrashAlt, FaCheck, FaTimes } from "react-icons/fa";

const Comment = ({ comment, onCommentUpdate }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleDelete = async () => {
    try {
      await axios.delete(`/comments/${comment._id}`);
      toast.success("Comment deleted");
      onCommentUpdate();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete comment");
    } finally {
      setShowConfirmDelete(false);
    }
  };

  const handleEdit = async () => {
    if (!editedContent.trim()) return toast.error("Comment cannot be empty");
    try {
      await axios.put(`/comments/${comment._id}`, { content: editedContent });
      toast.success("Comment updated");
      setIsEditing(false);
      onCommentUpdate();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update comment");
    }
  };

  return (
    <div className="bg-gray-900 p-4 rounded-xl shadow-md border border-gray-800 mb-4 transition-all duration-300">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="font-semibold text-sky-400 mb-1">
            {comment.author?.name || "Unknown"}
          </p>
          {isEditing ? (
            <input
              type="text"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all text-gray-200"
            />
          ) : (
            <p className="text-gray-300">{comment.content}</p>
          )}
        </div>
        
        {user?._id === comment.author?._id && (
          <div className="flex-shrink-0 flex gap-2 ml-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleEdit}
                  className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-3 py-1 rounded-full hover:from-sky-600 hover:to-blue-700 transition-colors"
                >
                  <FaCheck />
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedContent(comment.content);
                  }}
                  className="bg-gray-700 text-gray-400 px-3 py-1 rounded-full hover:bg-gray-600 transition-colors"
                >
                  <FaTimes />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-gray-700 text-sky-400 px-3 py-1 rounded-full hover:bg-gray-600 transition-colors"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => setShowConfirmDelete(true)}
                  className="bg-red-600 text-white px-3 py-1 rounded-full hover:bg-red-700 transition-colors"
                >
                  <FaTrashAlt />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {showConfirmDelete && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700 text-center">
          <p className="mb-2 text-gray-300">Are you sure you want to delete this comment?</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-red-700 transition-colors"
            >
              Confirm
            </button>
            <button
              onClick={() => setShowConfirmDelete(false)}
              className="bg-gray-700 text-gray-400 px-4 py-2 rounded-full font-semibold hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comment;
