import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { toast } from "react-toastify";

const AdminModerationPage = () => {
  const [reportedPosts, setReportedPosts] = useState([]);
  const [reportedComments, setReportedComments] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);

  const fetchReportedPosts = async () => {
    setLoadingPosts(true);
    try {
      const res = await axiosInstance.get("/posts/reported");
      setReportedPosts(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load reported posts");
    } finally {
      setLoadingPosts(false);
    }
  };

  const fetchReportedComments = async () => {
    setLoadingComments(true);
    try {
      const res = await axiosInstance.get("/comments/reported");
      setReportedComments(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load reported comments");
    } finally {
      setLoadingComments(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axiosInstance.delete(`/comments/${commentId}`);
      toast.success("Comment deleted");
      fetchReportedComments();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete comment");
    }
  };

  useEffect(() => {
    fetchReportedPosts();
    fetchReportedComments();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Moderation</h1>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Reported Posts</h2>
        {loadingPosts ? (
          <p>Loading reported posts...</p>
        ) : reportedPosts.length === 0 ? (
          <p>No reported posts found.</p>
        ) : (
          <div className="space-y-4">
            {reportedPosts.map((post) => (
              <div key={post._id} className="bg-white p-4 rounded shadow flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">{post.title}</h3>
                  <p className="text-gray-700">{post.content.slice(0, 100)}...</p>
                  <p className="text-sm text-gray-500">Reported by {post.reportedBy?.length || 0} users</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Reported Comments</h2>
        {loadingComments ? (
          <p>Loading reported comments...</p>
        ) : reportedComments.length === 0 ? (
          <p>No reported comments found.</p>
        ) : (
          <div className="space-y-4">
            {reportedComments.map((comment) => (
              <div key={comment._id} className="bg-white p-4 rounded shadow flex justify-between items-start">
                <div>
                  <p className="text-gray-800">{comment.content}</p>
                  <p className="text-sm text-gray-500">
                    On post: <span className="font-semibold">{comment.post?.title}</span> | By: {comment.author?.name || "Unknown"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminModerationPage;
