import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link
          to="/"
          className="group flex items-center gap-3"
          aria-label="Homepage"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-lg font-bold text-white shadow-lg shadow-sky-500/20 transition-transform duration-300 group-hover:scale-105">
            B
          </div>

          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white">
              Blogging
            </span>
            <span className="text-xs text-slate-400">Premium Publishing</span>
          </div>
        </Link>

        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <NavLink
                to="/my-posts"
                className={({ isActive }) =>
                  `rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-sky-500/15 text-sky-400"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                My Posts
              </NavLink>

              <NavLink
                to="/create-post"
                className={({ isActive }) =>
                  `rounded-xl px-5 py-2.5 text-sm font-semibold shadow-lg transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white"
                      : "bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:scale-105 hover:shadow-sky-500/30"
                  }`
                }
              >
                + Create Post
              </NavLink>

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 text-sm font-bold text-white shadow-lg">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <button
                onClick={logout}
                className="rounded-xl border border-red-500/30 px-4 py-2 text-sm font-semibold text-red-400 transition-all duration-300 hover:bg-red-500 hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/blogs"
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                Blogs
              </NavLink>
              <NavLink
                to="/auth"
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                Login
              </NavLink>

              <NavLink
                to="/auth"
                className="rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-sky-500/30"
              >
                Get Started
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
