import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import { useCallback } from "react";
import LikeButton from "../../components/LikeButton";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import PostDetailComments from "../../components/PostDetailComments";

const PostDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const fetchPost = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/posts/${id}`);
      console.log(res.data);
      setPost(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load post");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleSavePost = async () => {
    try {
      if (!user) {
        return toast.error("Please login first");
      }
      await axios.put(`/posts/${post._id}/save`);
      setSaved((prev) => {
        const next = !prev;

        toast.success(
          next ? "Post saved successfully" : "Removed from saved posts",
        );

        return next;
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Failed to save post",
      );
    }
  };

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  useEffect(() => {
    setSaved(user?.savedPosts?.includes(post?._id) || false);
  }, [user, post]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full" />
      </div>
    );
  if (!post)
    return <p className="text-center mt-6 text-gray-400">Post not found</p>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-gray-300">
      <Navbar />
      <div className="flex-grow p-6 max-w-4xl mx-auto w-full">
        <div className="bg-gray-900 p-8 rounded-xl shadow-2xl border border-gray-800">
          {post.coverImage && (
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-80 object-cover rounded-lg mb-6"
            />
          )}

          <h1 className="text-4xl font-extrabold text-gray-100 mb-2">
            {post.title}
          </h1>
          <p className="text-gray-400 mb-4 text-sm font-medium">
            By{" "}
            <span className="text-sky-400">
              {post.author?.name || "Unknown"}
            </span>{" "}
           |  {new Date(post.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>

          <div
            className="prose prose-lg max-w-none text-gray-300 dark:text-gray-400"
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></div>

          <div className="flex flex-wrap gap-2 mt-6">
            {post.tags?.map((tag) => (
              <span
                key={tag}
                className="bg-sky-500/20 text-sky-300 px-3 py-1 rounded-full text-sm font-semibold"
              >
                {tag.name}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={handleSavePost}
              className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                saved
                  ? "bg-gray-700 text-gray-400 hover:bg-gray-600"
                  : "bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-600 hover:to-blue-700"
              }`}
            >
              {saved ? "Unsave Post" : "Save Post"}
            </button>

            {post.author?._id === localStorage.getItem("userId") && (
              <Link
                to={`/post/edit/${post._id}`}
                className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:from-sky-600 hover:to-blue-700 transition-colors"
              >
                Edit Post
              </Link>
            )}
          </div>
        </div>

        <div className="mt-8">
          <hr className="border-t-2 border-gray-800 mb-6" />
          <LikeButton postId={post._id} />
          <PostDetailComments postId={post._id} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PostDetail;
