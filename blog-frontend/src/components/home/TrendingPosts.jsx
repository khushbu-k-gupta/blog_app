import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../api/axios";
import { toast } from "react-toastify";

const TrendingPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrendingPosts = async () => {
    try {
      const res = await axios.get("/posts");

      const sortedPosts = [...res.data.posts]
        .sort(
          (a, b) =>
            (b.likes?.length || 0) - (a.likes?.length || 0)
        )
        .slice(0, 4);

      setPosts(sortedPosts);
    } catch (error) {
      toast.error("Failed to load trending posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingPosts();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gray-950">
        <div className="text-center text-gray-400">
          Loading trending posts...
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Heading */}

        <div className="text-center mb-14">
          <span className="text-orange-400 uppercase tracking-widest font-semibold">
            🔥 Trending
          </span>

          <h2 className="mt-3 text-4xl md:text-5xl font-bold text-white">
            Most Popular Articles
          </h2>

          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            Discover the blogs that are getting the most attention from our readers.
          </p>
        </div>

        {/* Cards */}

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">

          {posts.map((post) => (

            <div
              key={post._id}
              className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-orange-500 transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative">

                <img
                  src={
                    post.coverImage ||
                    "https://placehold.co/600x400?text=No+Image"
                  }
                  alt={post.title}
                  className="w-full h-52 object-cover"
                />

                <span className="absolute top-4 left-4 bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                  🔥 Trending
                </span>

              </div>

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
                  className="mt-3 text-gray-400 text-sm line-clamp-3"
                  dangerouslySetInnerHTML={{
                    __html: post.content,
                  }}
                />

                <div className="flex flex-wrap gap-2 mt-5">
                  {post.tags?.slice(0, 2).map((tag) => (
                    <span
                      key={tag._id}
                      className="bg-orange-500/10 text-orange-300 px-3 py-1 rounded-full text-xs"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-6">

                  <div className="flex gap-4 text-sm text-gray-400">
                    <span>❤️ {post.likes?.length || 0}</span>
                    <span>💬 {post.comments?.length || 0}</span>
                  </div>

                  <Link
                    to={`/post/${post._id}`}
                    className="text-orange-400 hover:text-orange-300 font-semibold"
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

export default TrendingPosts;