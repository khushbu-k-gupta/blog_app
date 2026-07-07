import { useState } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import { FaBolt, FaSave, FaSpinner } from "react-icons/fa";

const AiPostGenerator = () => {
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic) {
      toast.error("Please enter a topic");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("/ai/generate-post", { topic });
      setContent(res.data.content || "");
      toast.success("Post generated successfully");

      const tagsRes = await axios.post("/ai/suggest-tags", { content: res.data.content });
      setTags(tagsRes.data.tags || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate post");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePost = async () => {
    if (!content) {
      toast.error("No content to save");
      return;
    }
    try {
      await axios.post("/posts", { title: topic, content, tags });
      toast.success("Post saved successfully");
      setTopic("");
      setContent("");
      setTags([]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save post");
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">AI Post Generator</h1>
      
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Enter a topic, e.g., 'The Future of AI'"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="flex-1 p-3 border  border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all
              ${loading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 shadow-md"}`}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" /> Generating...
              </>
            ) : (
              <>
                <FaBolt /> Generate Post
              </>
            )}
          </button>
        </div>

        {content && (
          <div className="mt-6">
            <textarea
              className="p-4 w-full h-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none transition-colors"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag, idx) => (
                <span 
                  key={idx} 
                  className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={handleSavePost}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 shadow-md transition-colors"
              >
                <FaSave /> Save Post
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiPostGenerator;