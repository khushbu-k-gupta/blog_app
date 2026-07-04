import { useState, useEffect } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const LikeButton = ({ postId }) => {
  const { user } = useAuth();
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await axios.get(`/posts/${postId}/like`);
        setLikes(res.data?.count);
        setLiked(user ? res.data?.users.includes(user._id) : false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchLikes();
  }, [postId, user]);

  const handleLike = async () => {
    if (!user) return toast.error("You must be logged in to like posts");
    try {
      if (liked) {
        await axios.post(`/posts/${postId}/like`);
        setLikes(likes - 1);
      } else {
        await axios.post(`/posts/${postId}/like`);
        setLikes(likes + 1);
      }
      setLiked(!liked);
    } catch (error) {
      toast.error("Failed to update like");
    }
  };

  return (
    <div className="flex items-center gap-2 mt-4">
      <button
        onClick={handleLike}
        className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-colors
          ${liked ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white" : "bg-gray-700 text-gray-400 hover:bg-gray-600"}`}
      >
        {liked ? <FaHeart className="text-white" /> : <FaRegHeart className="text-gray-400" />}
        <span className="ml-1">{liked ? "Liked" : "Like"}</span>
      </button>
      <span className="text-gray-400 font-semibold">{likes} {likes === 1 ? "Like" : "Likes"}</span>
    </div>
  );
};

export default LikeButton;
