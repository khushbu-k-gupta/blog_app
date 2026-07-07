import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import { FaUser, FaUserShield, FaCheckCircle, FaBan, FaTrashAlt, FaArrowUp, FaArrowDown } from "react-icons/fa";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const currentUserId = localStorage.getItem("userId");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/admin/users");
      setUsers(res.data);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async (user) => {
    if (user._id === currentUserId) {
      toast.error("You cannot block/unblock yourself");
      return;
    }
    try {
      const res = await axios.put(`/admin/users/${user._id}/block`);
      toast.success(res.data.message);
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, blocked: res.data.blocked } : u))
      );
    } catch (error) {
      toast.error("Failed to block/unblock user");
    }
  };

  const handleToggleRole = async (user) => {
    if (user._id === currentUserId) {
      toast.error("You cannot change your own role");
      return;
    }
    try {
      const res = await axios.put(`/admin/users/${user._id}/role`);
      toast.success(res.data.message);
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  const handleDelete = async (user) => {
    if (user._id === currentUserId) {
      toast.error("You cannot delete yourself");
      return;
    }
    if (!window.confirm(`Are you sure you want to delete ${user.name}?`)) return;
    try {
      const res = await axios.delete(`/admin/users/${user._id}`);
      toast.success(res.data.message);
      fetchUsers();
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">All Users</h1>

      {loading ? (
        <p className="text-gray-500 text-center">Loading users...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="min-w-full table-auto text-gray-800">
            <thead className="bg-gray-200 border-b-2 border-gray-300">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left hidden sm:table-cell">Email</th>
                <th className="p-4 text-left hidden md:table-cell">Role</th>
                <th className="p-4 text-left hidden md:table-cell">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="border-t border-gray-200 hover:bg-gray-100 transition-colors">
                    <td className="p-4 font-semibold">{user.name}</td>
                    <td className="p-4 hidden sm:table-cell">{user.email}</td>
                    <td className="p-4 hidden md:table-cell">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === "admin" ? "bg-blue-200 text-blue-800" : "bg-gray-300 text-gray-700"}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.blocked ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"}`}>
                        {user.blocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          className={`text-white px-3 py-1 rounded-full transition-colors ${user.blocked ? "bg-green-500 hover:bg-green-600" : "bg-yellow-500 hover:bg-yellow-600"} ${user._id === currentUserId ? "opacity-50 cursor-not-allowed" : ""}`}
                          onClick={() => handleBlock(user)}
                          disabled={user._id === currentUserId}
                          title={user.blocked ? "Unblock User" : "Block User"}
                        >
                          {user.blocked ? <FaCheckCircle /> : <FaBan />}
                        </button>
                        <button
                          className={`text-white px-3 py-1 rounded-full transition-colors ${user.role === "admin" ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"} ${user._id === currentUserId ? "opacity-50 cursor-not-allowed" : ""}`}
                          onClick={() => handleToggleRole(user)}
                          disabled={user._id === currentUserId}
                          title={user.role === "admin" ? "Demote to User" : "Promote to Admin"}
                        >
                          {user.role === "admin" ? <FaArrowDown /> : <FaArrowUp />}
                        </button>
                        <button
                          className={`text-white px-3 py-1 rounded-full transition-colors bg-gray-700 hover:bg-gray-800 ${user._id === currentUserId ? "opacity-50 cursor-not-allowed" : ""}`}
                          onClick={() => handleDelete(user)}
                          disabled={user._id === currentUserId}
                          title="Delete User"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Users;