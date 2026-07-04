import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { useAuth } from "./context/AuthContext";

// Pages
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import DashboardLayout from "./pages/Dashboard/DashboardLayout";
import Users from "./pages/Dashboard/Users";
import Posts from "./pages/Dashboard/Posts";
import Analytics from "./pages/Dashboard/Analytics";
import AiPostGenerator from "./pages/Dashboard/AiPostGenerator";

// Protected routes
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import CreatePost from "./pages/Post/CreatePost";
import MyPosts from "./pages/MyPosts";
import PostDetail from "./pages/Post/PostDetail";
import TagsAdmin from "./pages/Dashboard/TagsAdmin";
import SavedPosts from "./pages/SavedPosts";
import CommentsPage from "./pages/Dashboard/Comments";
import EditPost from "./pages/Post/EditPost";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";

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

        <Route
          path="/create-post"
          element={
            <ProtectedRoute>
              <CreatePost /> {/* Replace with CreatePost later */}
            </ProtectedRoute>
          }
        />
        <Route
          path="/post/:id"
          element={
            <ProtectedRoute>
              <PostDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-posts"
          element={
            <ProtectedRoute>
              <MyPosts /> {/* Replace with CreatePost later */}
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-post/:id"
          element={
            <ProtectedRoute>
              <EditPost /> {/* Replace with CreatePost later */}
            </ProtectedRoute>
          }
        />
        {/* Admin dashboard */}
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
