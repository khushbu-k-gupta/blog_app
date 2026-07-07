import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { useAuth } from "./context/AuthContext";

// Pages
import AuthPage from "./pages/auth/AuthPage";
import DashboardLayout from "./pages/admin/DashboardLayout";
import Users from "./pages/admin/Users";
import Posts from "./pages/admin/Posts";
import Analytics from "./pages/admin/Analytics";
import AiPostGenerator from "./pages/admin/AiPostGenerator";
import Home from "./pages/home/Home";

// Protected routes
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import CreatePost from "./pages/Post/CreatePost";
import PostDetail from "./pages/Post/PostDetail";
import TagsAdmin from "./pages/admin/TagsAdmin";
import SavedPosts from "./pages/Post/SavedPosts";
import CommentsPage from "./pages/admin/Comments";
import EditPost from "./pages/Post/EditPost";
import AdminDashboard from "./pages/admin/AdminDashboard";
import MyPosts from "./pages/Post/MyPosts";

function App() {
  const { loading } = useAuth();

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route
          path="/create-post"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-posts"
          element={
            <ProtectedRoute>
              <MyPosts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/saved-posts"
          element={
            <ProtectedRoute>
              <SavedPosts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-post/:id"
          element={
            <ProtectedRoute>
              <EditPost />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/*"
          element={
            <AdminRoute>
              <DashboardLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="tags" element={<TagsAdmin />} />
          {/* <Route path="users" element={<Users />} /> */}
          <Route path="posts" element={<Posts />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="ai" element={<AiPostGenerator />} />
          <Route path="comments" element={<CommentsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
}

export default App;
