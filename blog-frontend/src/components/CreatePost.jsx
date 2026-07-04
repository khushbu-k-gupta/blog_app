import { useState } from "react";
import { generatePost, suggestTags } from "../api/aiApi";

const CreatePost = () => {
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);

  const handleGenerate = async () => {
    const post = await generatePost(topic);
    setContent(post.content);

    const suggestedTags = await suggestTags(post.content);
    setTags(suggestedTags);
  };

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Post Topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="border p-2 w-full"
      />
      <button onClick={handleGenerate} className="bg-blue-500 text-white px-4 py-2 mt-2">
        Generate with AI
      </button>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="border p-2 w-full mt-2 h-60"
      />
      <div className="mt-2">
        {tags.map(tag => (
          <span key={tag} className="bg-gray-200 px-2 py-1 mr-1 rounded">{tag}</span>
        ))}
      </div>
    </div>
  );
};

export default CreatePost;
