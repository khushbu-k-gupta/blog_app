import { useAuth } from "../contexts/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <div className="p-4 w-64 bg-gray-100">
      <ul>
        <li>Home</li>
        <li>My Posts</li>
        {user?.role === "admin" && (
          <>
            <li>Manage Users</li>
            <li>Manage Posts</li>
            <li>Analytics</li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Sidebar