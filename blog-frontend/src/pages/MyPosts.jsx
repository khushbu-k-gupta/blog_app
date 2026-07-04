import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        let res;
        if (filter === "saved") {
          res = await axios.get("/posts/saved");
        } else {
          res = await axios.get("/posts");
          console.log(res.data);
        }

        let postsData = res.data;

        if (filter === "draft") {
          postsData = postsData.filter((post) => post.status === "draft");
        } else if (filter === "published") {
          postsData = postsData.filter((post) => post.status === "published");
        }

        setPosts(postsData);
      } catch (error) {
        toast.error("Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [filter]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-gray-300">
      <Navbar />
      <div className="flex-grow max-w-6xl mx-auto p-8 w-full">
        <h1 className="text-4xl font-extrabold text-gray-100 mb-8 text-center tracking-tight">
          My Posts
        </h1>

        <div className="flex justify-center flex-wrap gap-4 mb-10">
          <button
            className={`px-5 py-2 rounded-full font-bold transition-all duration-300 ${
              filter === "all"
                ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg transform scale-105"
                : "bg-gray-800 text-gray-400 hover:text-gray-100 hover:bg-gray-700"
            }`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`px-5 py-2 rounded-full font-bold transition-all duration-300 ${
              filter === "published"
                ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg transform scale-105"
                : "bg-gray-800 text-gray-400 hover:text-gray-100 hover:bg-gray-700"
            }`}
            onClick={() => setFilter("published")}
          >
            Published
          </button>
          <button
            className={`px-5 py-2 rounded-full font-bold transition-all duration-300 ${
              filter === "draft"
                ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg transform scale-105"
                : "bg-gray-800 text-gray-400 hover:text-gray-100 hover:bg-gray-700"
            }`}
            onClick={() => setFilter("draft")}
          >
            Draft
          </button>
          <button
            className={`px-5 py-2 rounded-full font-bold transition-all duration-300 ${
              filter === "saved"
                ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg transform scale-105"
                : "bg-gray-800 text-gray-400 hover:text-gray-100 hover:bg-gray-700"
            }`}
            onClick={() => setFilter("saved")}
          >
            Saved
          </button>
        </div>


        {loading ? (
          <p className="text-center text-gray-400 mt-10 text-xl">Loading posts...</p>
        ) : posts.length === 0 ? (
          <div className="text-center mt-10">
            <p className="text-gray-400 text-xl">No posts found.</p>
            <Link
              to="/create-post"
              className="mt-6 inline-block px-8 py-4 rounded-full font-bold shadow-lg transition-all duration-300 bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-600 hover:to-blue-700 transform hover:scale-105"
            >
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-gray-900 p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-800 transform hover:scale-105"
              >
                {post.coverImage && (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-48 object-cover mb-4 rounded-xl"
                  />
                )}
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl font-semibold text-gray-100">
                    {post.title}
                  </h2>
                  {post.status && (
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full uppercase ml-2 ${
                        post.status === "published"
                          ? "bg-sky-500/20 text-sky-300"
                          : "bg-gray-700/50 text-gray-400"
                      }`}
                    >
                      {post.status}
                    </span>
                  )}
                </div>

                {post.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-gray-400 line-clamp-3 mb-4">
                  {post.content}
                </p>

                <div className="flex justify-between items-center pt-4 border-t border-gray-800">
                  <span className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex gap-4">
                    <Link
                      to={`/post/${post._id}`}
                      className="text-sky-400 font-semibold hover:underline"
                    >
                      Read
                    </Link>

                    <Link
                      to={`/edit-post/${post._id}`}
                      className="text-blue-400 font-semibold hover:underline"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyPosts;
