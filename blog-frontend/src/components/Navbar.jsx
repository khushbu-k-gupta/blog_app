// import { Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const Navbar = () => {
// const { user, logout } = useAuth();

//   return (
//     <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-700 py-4">
//       <div className="container mx-auto flex justify-between items-center">
//         {/* Main Brand/Logo */}
//         <Link
//           to="/"
//           className="text-2xl font-bold tracking-wide transition-colors duration-300 hover:text-sky-300"
//         >
//           Blogging
//         </Link>

//         {/* Navigation Links */}
//         <div className="flex items-center space-x-6">
//           {user ? (
//             // Links for authenticated users
//             <>
//               <Link
//                 to="/my-posts"
//                 className="text-lg font-medium transition-colors duration-300 hover:text-sky-300"
//               >
//                 My Posts
//               </Link>
//               <Link
//                 to="/create-post"
//                 className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-sky-600 hover:to-blue-700 transition-colors duration-300"
//               >
//                 Create Post
//               </Link>
//               <button
//                 onClick={logout}
//                 className="text-lg font-medium transition-colors duration-300 hover:text-red-400"
//               >
//                 Logout
//               </button>
//             </>
//           ) : (
//             // Links for guest users
//             <>
//               <Link
//                 to="/auth"
//                 className="text-lg font-medium transition-colors duration-300 hover:text-sky-300"
//               >
//                 Login
//               </Link>
//               <Link
//                 to="/auth"
//                 className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-sky-600 hover:to-blue-700 transition-colors duration-300"
//               >
//                 Register
//               </Link>
//             </>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
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
            <span className="text-xs text-slate-400">
              Premium Publishing
            </span>
          </div>
        </Link>

        {/* Navigation */}
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

              {/* User Avatar */}
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