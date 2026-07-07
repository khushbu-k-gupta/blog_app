import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaUser, FaStickyNote, FaChartBar, FaRobot, FaTags, FaSignOutAlt, FaCommentAlt } from "react-icons/fa";

const DashboardLayout = () => {
  const { logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { to: "/dashboard", icon: <FaUser />, label: "Admin Dashboard" },
    { to: "/dashboard/posts", icon: <FaStickyNote />, label: "Manage Posts" },
    { to: "/dashboard/ai", icon: <FaRobot />, label: "AI Post Generator" },
    { to: "/dashboard/tags", icon: <FaTags />, label: "Manage Tags" },
    { to: "/dashboard/comments", icon: <FaCommentAlt />, label: "Manage Comments" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-950 text-purple-100">
      <aside className="w-64 bg-gray-900 shadow-2xl p-6 flex flex-col border-r border-purple-800">
        <h2 className="text-3xl font-bold mb-8 text-white pl-4">Admin Panel</h2>
        <nav className="flex-grow flex flex-col gap-4">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors
                ${location.pathname === item.to ? "bg-purple-500 text-white" : "text-purple-200 hover:bg-purple-600 hover:text-white"}`}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>
        <button 
          onClick={logout} 
          className="flex items-center gap-3 w-full justify-center mt-auto px-4 py-3 rounded-lg font-semibold bg-red-600 hover:bg-red-700 transition-colors mb-10"
        >
          <FaSignOutAlt /> Logout
        </button>
      </aside>
      
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
