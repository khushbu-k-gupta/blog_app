import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FaUsers, FaFileAlt, FaChartBar, FaRobot } from "react-icons/fa";

const DashboardSidebar = () => {
  const { user } = useAuth();

  if (!user || user.role !== "admin") return null; 

  const links = [
    { name: "Users", path: "users", icon: <FaUsers /> },
    { name: "Posts", path: "posts", icon: <FaFileAlt /> },
    { name: "Analytics", path: "analytics", icon: <FaChartBar /> },
    { name: "AI Post Generator", path: "ai", icon: <FaRobot /> },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white h-screen p-4">
      <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
      <nav className="flex flex-col gap-3">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={`/dashboard/${link.path}`}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700 ${
                isActive ? "bg-gray-700 font-semibold" : ""
              }`
            }
          >
            {link.icon} {link.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
