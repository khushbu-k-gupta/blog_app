import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../api/axios";
import { toast } from "react-toastify";

const LatestPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLatestPosts = async () => {
    try {
      const res = await axios.get("/posts");

      // Latest 6 posts
      setPosts(res.data?.posts.slice(0, 6));
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load latest posts"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestPosts();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400 text-lg">Loading latest posts...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Heading */}

        <div className="flex flex-col md:flex-row justify-between items-center mb-12">

          <div>
            <span className="text-sky-400 uppercase tracking-widest font-semibold">
              Latest
            </span>

            <h2 className="text-4xl font-bold text-white mt-2">
              Latest Articles
            </h2>

            <p className="text-gray-400 mt-3">
              Stay updated with our newest blogs and tutorials.
            </p>
          </div>

          <Link
            to="/blogs"
            className="mt-6 md:mt-0 px-6 py-3 rounded-full bg-sky-600 hover:bg-sky-500 transition text-white font-semibold"
          >
            View All →
          </Link>

        </div>

        {/* Grid */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {posts.map((post) => (

            <div
              key={post._id}
              className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-sky-500 transition duration-300 group"
            >
              {/* Cover */}

              <img
                src={
                  post.coverImage ||
                  "https://placehold.co/600x400?text=No+Image"
                }
                alt={post.title}
                className="w-full h-52 object-cover group-hover:scale-105 transition duration-500"
              />

              {/* Body */}

              <div className="p-5">

                <div className="flex justify-between text-xs text-gray-500 mb-3">
                  <span>{post.author?.name}</span>

                  <span>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white line-clamp-2">
                  {post.title}
                </h3>

                <div
                  className="text-gray-400 mt-3 text-sm line-clamp-3"
                  dangerouslySetInnerHTML={{
                    __html: post.content,
                  }}
                />

                {/* Tags */}

                <div className="flex flex-wrap gap-2 mt-5">
                  {post.tags?.slice(0, 2).map((tag) => (
                    <span
                      key={tag._id}
                      className="bg-sky-500/10 text-sky-400 text-xs px-3 py-1 rounded-full"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>

                {/* Footer */}

                <div className="flex justify-between items-center mt-6">

                  <div className="flex gap-4 text-gray-500 text-sm">

                    <span>❤️ {post.likes?.length || 0}</span>

                    <span>💬 {post.comments?.length || 0}</span>

                  </div>

                  <Link
                    to={`/post/${post._id}`}
                    className="text-sky-400 hover:text-sky-300 font-semibold"
                  >
                    Read →
                  </Link>

                </div>

              </div>
            </div>

          ))}

        </div>

      </div>
    </section>
  );
};

export default LatestPosts;