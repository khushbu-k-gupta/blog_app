import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

const CreatePost = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");

  const [category, setCategory] = useState("");

  const [categories, setCategories] = useState([]);

  const [tags, setTags] = useState([]);
  const [allTags, setAllTags] = useState([]);

  const [status, setStatus] = useState("draft");

  const [coverImage, setCoverImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/categories");
      setCategories(res.data);
    } catch (err) {
      toast.error("Failed to load categories", err.message);
    }
  };

  const fetchTags = async () => {
    try {
      const res = await axios.get("/users/tags");
      setAllTags(res.data);
    } catch (err) {
      toast.error("Failed to load tags", err.message);
    }
  };
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only images are allowed");
      return;
    }

    // if (file.size > 2 * 1024 * 1024) {
    //   toast.error("Image size must be below 2MB");
    //   return;
    // }

    setCoverImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const toggleTag = (id) => {
    setTags((prev) =>
      prev.includes(id) ? prev.filter((tag) => tag !== id) : [...prev, id],
    );
  };

  const handleGenerate = async () => {
    if (!title.trim()) {
      return toast.error("Enter title first");
    }

    setIsGenerating(true);

    try {
      const res = await axios.post("/ai/generate-post", {
        topic: title,
      });

      setContent(res.data.content);

      if (!excerpt) {
        setExcerpt(res.data.content.slice(0, 200));
      }

      toast.success("Content generated");
    } catch (err) {
      toast.error(err.response?.data?.message || "AI generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) return toast.error("Title required");

    if (!category) return toast.error("Select category");

    if (!excerpt.trim()) return toast.error("Excerpt required");

    if (!content.trim()) return toast.error("Content required");

    setIsSaving(true);

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("excerpt", excerpt);
      formData.append("content", content);
      formData.append("category", category);
      formData.append("status", status);

      tags.forEach((id) => {
        formData.append("tags", id);
      });

      if (coverImage) {
        formData.append("coverImage", coverImage);
      }
      await axios.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(status === "draft" ? "Draft saved" : "Post published");

      navigate("/my-posts");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create post");
    } finally {
      setIsSaving(false);
    }
  };
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],

      ["bold", "italic", "underline"],

      [{ list: "ordered" }, { list: "bullet" }],

      ["blockquote"],

      ["code-block"],

      ["link"],

      ["image"],

      ["clean"],
    ],
  };
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Navbar />

      <div className="flex-1 py-10 px-4">
        <div className="max-w-5xl mx-auto bg-gray-900 border border-gray-800 rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold">Create New Blog</h1>

            <p className="text-gray-400 mt-2">
              Write, generate and publish your next article.
            </p>
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-semibold">Blog Title *</label>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title..."
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 outline-none focus:border-sky-500"
            />

            <div className="text-right text-gray-500 text-sm mt-1">
              {title.length}/100
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-semibold">Category *</label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3"
            >
              <option value="">Select Category</option>

              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-semibold">
              Short Description *
            </label>

            <textarea
              rows={4}
              value={excerpt}
              maxLength={250}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Write short summary..."
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 resize-none"
            />

            <div className="text-right text-gray-500 text-sm mt-1">
              {excerpt.length}/250
            </div>
          </div>

          {/* <div className="mb-8">
            <label className="block mb-3 font-semibold">Cover Image</label>

            <input type="file" accept="image/*" onChange={handleImageChange} />

            {preview && (
              <img
                src={preview}
                alt=""
                className="mt-5 rounded-xl h-72 w-full object-cover border border-gray-700"
              />
            )}
          </div> */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-white mb-3">
              Cover Image
            </label>

            <label
              htmlFor="coverImage"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-600 rounded-2xl cursor-pointer bg-gray-900 hover:border-sky-500 hover:bg-gray-800 transition-all duration-300"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-14 h-14 text-sky-400 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5V18a3 3 0 003 3h12a3 3 0 003-3v-1.5M16.5 7.5L12 3m0 0L7.5 7.5M12 3v13.5"
                    />
                  </svg>

                  <p className="text-lg font-medium text-gray-300">
                    Click to upload cover image
                  </p>

                  <p className="text-sm text-gray-500 mt-2">
                    PNG, JPG, JPEG (Max 5 MB)
                  </p>
                </>
              )}
            </label>

            <input
              id="coverImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            {preview && (
              <button
                type="button"
                onClick={() => {
                  setCoverImage(null);
                  setPreview(null);
                }}
                className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition"
              >
                Remove Image
              </button>
            )} 
          </div>

          <div className="mb-8">
            <button
              disabled={isGenerating}
              onClick={handleGenerate}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:opacity-90 font-semibold"
            >
              {isGenerating ? "Generating..." : "Generate Article with AI"}
            </button>
          </div>

          <div className="mb-8">
            <label className="block mb-3 font-semibold">Content *</label>

            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              className="bg-white text-black rounded-lg"
            />
          </div>

          <div className="mb-8">
            <label className="block mb-3 font-semibold">Tags</label>
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            {allTags.map((tag) => (
              <button
                key={tag._id}
                onClick={() => toggleTag(tag._id)}
                className={`px-4 py-2 rounded-full transition

              ${
                tags.includes(tag._id)
                  ? "bg-sky-500 text-white"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
              >
                {tag.name}
              </button>
            ))}
          </div>

          {tags.length > 0 && (
            <div className="mb-8">
              <h3 className="mb-3 font-semibold">Selected Tags</h3>

              <div className="flex flex-wrap gap-3">
                {allTags
                  .filter((tag) => tags.includes(tag._id))
                  .map((tag) => (
                    <div
                      key={tag._id}
                      className="bg-sky-600 rounded-full px-4 py-2 flex items-center gap-2"
                    >
                      {tag.name}
                    </div>
                  ))}
              </div>
            </div>
          )}

          <div className="mb-10">
            <h3 className="font-semibold mb-3">Publishing</h3>

            <div className="flex gap-8">
              <label className="flex gap-2 items-center">
                <input
                  type="radio"
                  checked={status === "draft"}
                  onChange={() => setStatus("draft")}
                />
                Draft
              </label>

              <label className="flex gap-2 items-center">
                <input
                  type="radio"
                  checked={status === "published"}
                  onChange={() => setStatus("published")}
                />
                Publish
              </label>
            </div>
          </div>

          <button
            disabled={isSaving}
            onClick={handleSave}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-lg font-bold hover:opacity-90"
          >
            {isSaving
              ? "Saving..."
              : status === "draft"
                ? "Save Draft"
                : "Publish Post"}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};
export default CreatePost;
