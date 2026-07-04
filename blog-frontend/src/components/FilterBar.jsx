import { useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const FilterBar = () => {
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const tagsRes = await axios.get("/tags");
        const categoriesRes = await axios.get("/categories");
        setTags(tagsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error("Failed to fetch filters");
      }
    };
    fetchFilters();
  }, []);

  const handleFilter = () => {
    const query = new URLSearchParams();
    if (selectedTag) query.append("tag", selectedTag);
    if (selectedCategory) query.append("category", selectedCategory);
    navigate(`/posts?${query.toString()}`);
  };

  return (
    <div className="flex gap-2 mb-4">
      <select
        value={selectedTag}
        onChange={(e) => setSelectedTag(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">All Tags</option>
        {tags.map((tag) => (
          <option key={tag._id} value={tag.name}>
            {tag.name}
          </option>
        ))}
      </select>

      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>

      <button
        onClick={handleFilter}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Filter
      </button>
    </div>
  );
};

export default FilterBar;
