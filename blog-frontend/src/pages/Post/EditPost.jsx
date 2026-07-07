import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [status, setStatus] = useState("draft");
  const [coverImage, setCoverImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [excerpt, setExcerpt] = useState("");

  const fetchPost = useCallback(async () => {
    try {
      const res = await axios.get(`/posts/${id}`);
      setTitle(res.data.title);
      setContent(res.data.content);
      setStatus(res.data.status);
      setPreviewImage(res.data.coverImage);

      setExcerpt(res.data.excerpt);

      setCategory(res.data.category?._id || "");

      setTags(res.data.tags?.map((tag) => tag._id) || []);
    } catch (error) {
      toast.error("Failed to load post");
      console.error(error);
    }
  }, [id]);

  const fetchAllTags = useCallback(async () => {
    try {
      const res = await axios.get("/admin/tags");
      setAllTags(res.data);
    } catch (error) {
      console.error(error);
    }
  }, []);
  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchPost();
    fetchAllTags();
    fetchCategories();
  }, [fetchPost, fetchAllTags, fetchCategories]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const toggleTag = (tagId) => {
    setTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  };

  const handleUpdate = async () => {
    if (!title || !content) return toast.error("Title and content required");

    setLoading(true);
    try {
      const formData = new FormData();
      tags.forEach((id) => {
        formData.append("tags", id);
      });

      formData.append("category", category);
      formData.append("excerpt", excerpt);

      formData.append("title", title);
      formData.append("content", content);
      formData.append("status", status);

      if (coverImage) {
        formData.append("coverImage", coverImage);
      }
      await axios.put(`/posts/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // await axios.put(`/posts/${id}/status`, { status });
      if (!title.trim()) return toast.error("Title required");

      if (!content.trim()) return toast.error("Content required");

      if (!category) return toast.error("Category required");

      if (!excerpt.trim()) return toast.error("Excerpt required");
      toast.success("Post updated successfully");
      navigate(`/post/${id}`);
    } catch (error) {
      toast.error("Failed to update post");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };
  useEffect(() => {
  return () => {
    if (
      previewImage &&
      previewImage.startsWith("blob:")
    ) {
      URL.revokeObjectURL(previewImage);
    }
  };
}, [previewImage]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-gray-300">
      <Navbar />
      <div className="max-w-3xl mx-auto p-4 bg-gray-900 text-gray-100 rounded-lg my-10">
        <h1 className="text-2xl font-bold mb-4 text-white">Edit Post</h1>

        <input
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-gray-700 bg-gray-800 text-white placeholder-gray-400 p-2 rounded w-full mb-2"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-gray-700 bg-gray-800 text-white p-2 rounded mb-2"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white mb-4"
        >
          <option value="">Select Category</option>

          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={4}
          maxLength={250}
          placeholder="Short description..."
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white resize-none"
        />

        <p className="text-right text-gray-500 text-sm">{excerpt.length}/250</p>

        <div className="mb-2">
          {previewImage && (
            <img
              src={previewImage}
              alt="Cover"
              className="w-full h-48 object-cover mb-2 rounded border border-gray-700"
            />
          )}
          <input
            type="file"
            onChange={handleImageChange}
            className="text-gray-400"
          />
        </div>

        <ReactQuill
          value={content}
          onChange={setContent}
          modules={modules}
          className="mb-2 react-quill-dark-override"
          theme="snow"
        />

        <div className="flex flex-wrap gap-2 mb-4">
          {allTags.map((tag) => (
            <span
              key={tag._id}
              onClick={() => toggleTag(tag._id)}
              className={`px-3 py-1 rounded-full cursor-pointer transition ${
                tags.includes(tag._id)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {tag.name}
            </span>
          ))}
        </div>
        <button
          onClick={handleUpdate}
          disabled={loading}
          className={`px-4 py-2 rounded transition-colors ${
            loading
              ? "bg-indigo-700 text-gray-400 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-500"
          }`}
        >
          {loading ? "Updating..." : "Update Post"}
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default EditPost;
