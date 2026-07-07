import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import axios from "../api/axios";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axios";

const FeaturedPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeaturedPosts = async () => {
    try {
      const res = await axiosInstance.get("/posts");

      // Sirf first 3 posts
      setPosts(res.data.slice(0, 3));
    } catch (error) {
      toast.error("Failed to load featured posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedPosts();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400">Loading featured posts...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Heading */}

        <div className="text-center mb-14">
          <span className="text-sky-400 uppercase tracking-widest font-semibold">
            Featured
          </span>

          <h2 className="text-4xl md:text-5xl font-bold text-white mt-3">
            Featured Articles
          </h2>

          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Explore some of the most valuable articles written by our community.
          </p>
        </div>

        {/* Cards */}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden hover:border-sky-500 transition duration-300 group"
            >
              {/* Image */}

              <img
                src={
                  post.coverImage ||
                  "https://placehold.co/600x400?text=No+Image"
                }
                alt={post.title}
                className="w-full h-56 object-cover group-hover:scale-105 transition duration-500"
              />

              {/* Content */}

              <div className="p-6">

                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>{post.author?.name}</span>

                  <span>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white mt-4 line-clamp-2">
                  {post.title}
                </h3>

                <p
                  className="text-gray-400 mt-4 line-clamp-3"
                  dangerouslySetInnerHTML={{
                    __html: post.content,
                  }}
                />

                <div className="flex items-center justify-between mt-6">

                  <div className="flex gap-2 flex-wrap">
                    {post.tags?.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-sky-500/10 text-sky-400 px-3 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
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

export default FeaturedPosts;