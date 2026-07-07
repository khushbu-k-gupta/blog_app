import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import { FaUser, FaPenNib, FaHeart, FaCommentAlt } from "react-icons/fa";
import AdminModerationPage from "./AdminModeration";

const Analytics = () => {
  const [stats, setStats] = useState(null);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get("/admin/analytics");
      setStats(res.data);
    } catch (error) {
      toast.error("Failed to fetch analytics");
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (!stats) return <p className="text-gray-500 text-center mt-6">Loading analytics...</p>;

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Analytics Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        
        <div className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-4">
          <FaUser className="text-green-600 text-3xl" />
          <div>
            <h2 className="text-sm font-semibold text-gray-500">Total Users</h2>
            <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-4">
          <FaPenNib className="text-green-600 text-3xl" />
          <div>
            <h2 className="text-sm font-semibold text-gray-500">Total Posts</h2>
            <p className="text-3xl font-bold text-gray-800">{stats.totalPosts}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-4">
          <FaHeart className="text-green-600 text-3xl" />
          <div>
            <h2 className="text-sm font-semibold text-gray-500">Total Likes</h2>
            <p className="text-3xl font-bold text-gray-800">{stats.totalLikes}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-4">
          <FaCommentAlt className="text-green-600 text-3xl" />
          <div>
            <h2 className="text-sm font-semibold text-gray-500">Total Comments</h2>
            <p className="text-3xl font-bold text-gray-800">
              {stats.totalComments || "N/A"}
            </p>
          </div>
        </div>

      </div>
      {/* <AdminModerationPage/> */}
    </div>
  );
};

export default Analytics;