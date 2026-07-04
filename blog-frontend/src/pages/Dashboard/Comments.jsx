import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { FaCheckCircle, FaTimesCircle, FaSearch } from "react-icons/fa";

const AdminCommentsPage = () => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 6;

  const isAdmin = user?.role === "admin";

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/comments");
      setComments(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchComments();
  }, [isAdmin]);

  const updateStatus = async (id, status) => {
    try {
      await axiosInstance.patch(`/comments/${id}/status`, { status });
      toast.success(`Comment ${status}`);
      fetchComments();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  const filteredComments = comments
    .filter((comment) => (filter === "all" ? true : comment.status === filter))
    .filter(
      (comment) =>
        comment.content.toLowerCase().includes(search.toLowerCase()) ||
        comment.author?.name?.toLowerCase().includes(search.toLowerCase())
    );

  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = filteredComments.slice(
    indexOfFirstComment,
    indexOfLastComment
  );
  const totalPages = Math.ceil(filteredComments.length / commentsPerPage);

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-xl font-semibold text-red-600">
          Access Denied. You must be an admin to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 ">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Admin Comments Dashboard
        </h1>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex justify-center gap-2 flex-wrap bg-gray-200 rounded-full p-1 sm:p-2 flex-1">
            {["all", "pending", "approved", "rejected"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 rounded-full font-semibold transition-colors text-sm ${
                  filter === tab
                    ? "bg-green-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => setFilter(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search comments..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-2 pl-10 border text-gray-400 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Loading comments...</p>
        ) : currentComments.length === 0 ? (
          <p className="text-center text-gray-600">No comments found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentComments.map((comment) => (
              <div
                key={comment._id}
                className="bg-gray-100 p-4 rounded-xl shadow-sm flex flex-col justify-between"
              >
                <div>
                  <p className="text-gray-800 font-medium mb-2">{comment.content}</p>
                  <p className="text-sm text-gray-500">
                    On post:{" "}
                    <span className="font-semibold text-gray-700">
                      {comment.post?.title || "Deleted Post"}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    By: {comment.author?.name || "Unknown"} •{" "}
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full min-w-[70px] text-center ${
                      comment.status === "approved"
                        ? "bg-green-200 text-green-800"
                        : comment.status === "pending"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {comment.status}
                  </span>
                  {comment.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateStatus(comment._id, "approved")}
                        className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                        title="Approve"
                      >
                        <FaCheckCircle />
                      </button>
                      <button
                        onClick={() => updateStatus(comment._id, "rejected")}
                        className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                        title="Reject"
                      >
                        <FaTimesCircle />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            <span className="text-gray-700 font-semibold">
              {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCommentsPage;