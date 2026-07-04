import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const CreatePost = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [allTags, setAllTags] = useState([]);
  const [status, setStatus] = useState("draft");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch existing tags for user
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await axios.get("/users/tags"); 
        setAllTags(res.data.map((tag) => tag.name));
        console.log(res.data)
      } catch (error) {
        console.error("Failed to fetch tags", error);
      }
    };
    fetchTags();
  }, []);

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (idx) => {
    setTags(tags.filter((_, i) => i !== idx));
  };

  const toggleTag = (tag) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleGenerate = async () => {
    if (!title) return toast.error("Please enter a topic/title");
    setLoading(true);
    try {
      const res = await axios.post("/ai/generate-post", { topic: title });
      setContent(res.data.content || "");
      toast.success("Post content generated successfully");

      const tagsRes = await axios.post("/ai/suggest-tags", {
        content: res.data.content,
      });
      setTags(tagsRes.data.tags || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate post or tags");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title || !content) return toast.error("Title and content required");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("status", "draft");
      tags.forEach((tag) => formData.append("tags[]", tag));
      if (image) formData.append("coverImage", image);

      const res = await axios.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Post created successfully");

      if (status !== "draft") {
        await axios.put(`/posts/${res.data._id}/status`, { status });
        toast.success("Post published successfully");
      }

      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create post");
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
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="bg-gray-900 p-10 rounded-xl shadow-2xl w-full max-w-4xl border border-gray-800">
          <h1 className="text-3xl font-bold text-gray-100 mb-6 text-center">
            Create a New Post
          </h1>

          <div className="flex flex-col gap-6">
            {/* Title */}
            <input
              type="text"
              placeholder="Enter post title/topic"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-700 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all placeholder-gray-500"
            />

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-3 text-lg font-bold rounded-lg transition-all duration-300 bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-600 hover:to-blue-700 transform hover:scale-105"
            >
              {loading ? "Generating..." : "Generate with AI"}
            </button>

            <ReactQuill
              value={content}
              onChange={setContent}
              modules={modules}
              className="bg-gray-800 rounded-lg text-gray-200 quill-dark"
              theme="snow"
            />

            <div className="flex gap-2 items-center mt-2">
              <input
                type="text"
                placeholder="Add a tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                className="p-3 border border-gray-700 bg-gray-800 text-gray-200 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder-gray-500"
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-sky-500/20 text-sky-300 px-3 py-1 rounded-full flex items-center gap-1 font-semibold"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(idx)}
                    className="text-red-500 hover:text-red-300 font-bold ml-1 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {allTags.map((tag, idx) => (
                <span
                  key={idx}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-colors ${
                    tags.includes(tag) ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-6 mt-4">
              <label className="flex items-center gap-2 text-gray-400">
                <input
                  type="radio"
                  value="draft"
                  checked={status === "draft"}
                  onChange={() => setStatus("draft")}
                  className="accent-sky-500 w-4 h-4"
                />
                Save as Draft
              </label>
              <label className="flex items-center gap-2 text-gray-400">
                <input
                  type="radio"
                  value="published"
                  checked={status === "published"}
                  onChange={() => setStatus("published")}
                  className="accent-sky-500 w-4 h-4"
                />
                Publish Post
              </label>
            </div>

            <button
              onClick={handleSave}
              className="w-full py-3 mt-4 text-lg font-bold rounded-lg shadow-lg transition-all duration-300 bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-600 hover:to-blue-700 transform hover:scale-105"
            >
              {loading ? "Saving..." : "Save Post"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreatePost;
