import { lazy } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminRoute from "../components/AdminRoute";

// Pages
const CreatePost = lazy(() => import("../pages/Post/CreatePost"));
const EditPost = lazy(() => import("../pages/Post/EditPost"));
const PostDetail = lazy(() => import("../pages/Post/PostDetail"));
const DashboardLayout = lazy(() => import("../pages/Dashboard/DashboardLayout"));
const Users = lazy(() => import("../pages/Dashboard/Users"));
const Posts = lazy(() => import("../pages/Dashboard/Posts"));
const Analytics = lazy(() => import("../pages/Dashboard/Analytics"));
const AiPostGenerator = lazy(() => import("../pages/Dashboard/AiPostGenerator"));

export const routes = (user) => [
  {
    path: "/create-post",
    element: (
      <ProtectedRoute>
        <CreatePost />
      </ProtectedRoute>
    ),
  },
  {
    path: "/post/:id",
    element: (
      <ProtectedRoute>
        <PostDetail />
      </ProtectedRoute>
    ),
  },
  {
    path: "/post/edit/:id",
    element: (
      <ProtectedRoute>
        <EditPost />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <AdminRoute>
        <DashboardLayout />
      </AdminRoute>
    ),
    children: [
      { path: "users", element: <Users /> },
      { path: "posts", element: <Posts /> },
      { path: "analytics", element: <Analytics /> },
      { path: "ai", element: <AiPostGenerator /> },
    ],
  },
];
