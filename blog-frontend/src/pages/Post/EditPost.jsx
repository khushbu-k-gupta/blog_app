import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; 
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [allTags, setAllTags] = useState([]);
  const [status, setStatus] = useState("draft");
  const [coverImage, setCoverImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPost = async () => {
    try {
      const res = await axios.get(`/posts/${id}`);
      setTitle(res.data.title);
      setContent(res.data.content);
      setTags(res.data.tags || []);
      setStatus(res.data.status || "draft");
      setPreviewImage(res.data.coverImage || null);
    } catch (error) {
      toast.error("Failed to load post");
      console.error(error);
    }
  };

  const fetchAllTags = async () => {
    try {
      const res = await axios.get("/admin/tags");
      setAllTags(res.data.map((t) => t.name));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPost();
    fetchAllTags();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const toggleTag = (tagName) => {
    setTags((prev) =>
      prev.includes(tagName) ? prev.filter((t) => t !== tagName) : [...prev, tagName]
    );
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (idx) => {
    setTags(tags.filter((_, i) => i !== idx));
  };

  const handleUpdate = async () => {
    if (!title || !content) return toast.error("Title and content required");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("tags", JSON.stringify(tags));
      if (coverImage) formData.append("coverImage", coverImage);

      await axios.put(`/posts/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await axios.put(`/posts/${id}/status`, { status });

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

      <div className="mb-2">
        {previewImage && (
          <img
            src={previewImage}
            alt="Cover"
            className="w-full h-48 object-cover mb-2 rounded border border-gray-700"
          />
        )}
        <input type="file" onChange={handleImageChange} className="text-gray-400" />
      </div>

      <ReactQuill
        value={content}
        onChange={setContent}
        modules={modules}
        className="mb-2 react-quill-dark-override" 
        theme="snow"
      />

      <div className="flex gap-2 items-center mt-2 mb-2">
        <input
          type="text"
          placeholder="Add a tag"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
          className="p-2 border border-gray-700 bg-gray-800 text-white placeholder-gray-400 rounded-lg flex-1"
        />
        <button
          onClick={handleAddTag}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 transition-colors"
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, idx) => (
          <span
            key={idx}
            className="bg-purple-600 text-white px-2 py-1 rounded flex items-center gap-1"
          >
            {tag}
            <button
              onClick={() => handleRemoveTag(idx)}
              className="text-white/70 hover:text-white font-bold transition-colors"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {allTags.map((tag, idx) => (
          <span
            key={idx}
            onClick={() => toggleTag(tag)}
            className={`px-2 py-1 rounded cursor-pointer transition-colors ${
              tags.includes(tag) ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-200 hover:bg-gray-600"
            }`}
          >
            {tag}
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