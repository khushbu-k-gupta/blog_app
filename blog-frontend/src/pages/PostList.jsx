import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "../../api/axios";
import SearchBar from "../../components/SearchBar";
import FilterBar from "../../components/FilterBar";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const { search } = useLocation();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`/posts${search}`);
        setPosts(res.data);
      } catch (error) {
        console.error("Failed to fetch posts");
      }
    };
    fetchPosts();
  }, [search]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <SearchBar />
      <FilterBar />

      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="border p-4 mb-4 rounded">
            <Link to={`/post/${post._id}`}>
              <h2 className="text-xl font-bold">{post.title}</h2>
            </Link>
            <p className="text-gray-500">{post.content.slice(0, 150)}...</p>
          </div>
        ))
      )}
    </div>
  );
};

export default PostList;
