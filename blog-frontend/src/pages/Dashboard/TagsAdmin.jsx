import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import { FaPlus, FaEdit, FaTrashAlt, FaSave, FaTimes } from "react-icons/fa";

const TagsAdmin = () => {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [editingTag, setEditingTag] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTags = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/admin/tags");
      setTags(res.data);
    } catch (error) {
      toast.error("Failed to fetch tags");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newTag.trim()) {
      toast.error("Tag name is required");
      return;
    }
    try {
      await axios.post("/admin/tags", { name: newTag });
      toast.success("Tag created successfully");
      setNewTag("");
      fetchTags();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create tag");
    }
  };

  const handleEdit = async (id) => {
    if (!editingTag?.name?.trim()) {
      toast.error("Tag name is required");
      return;
    }
    try {
      await axios.put(`/admin/tags/${id}`, { name: editingTag.name });
      toast.success("Tag updated successfully");
      setEditingTag(null);
      fetchTags();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to edit tag");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tag?")) return;
    try {
      await axios.delete(`/admin/tags/${id}`);
      toast.success("Tag deleted successfully");
      fetchTags();
    } catch (error) {
      toast.error("Failed to delete tag");
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Tags</h1>

      <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Tag</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Enter new tag name"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            className="flex-1 p-3 border text-gray-400 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
          />
          <button
            onClick={handleCreate}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 shadow-md transition-colors"
          >
            <FaPlus /> Add Tag
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg overflow-hidden">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Existing Tags</h2>
        {loading ? (
          <p className="text-gray-500 text-center">Loading tags...</p>
        ) : (
          <table className="min-w-full table-auto text-gray-800">
            <thead className="bg-gray-200 border-b-2 border-gray-300">
              <tr>
                <th className="p-4 text-left">Tag Name</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tags.length > 0 ? (
                tags.map((tag) => (
                  <tr key={tag._id} className="border-t border-gray-200 hover:bg-gray-100 transition-colors">
                    <td className="p-4">
                      {editingTag && editingTag.id === tag._id ? (
                        <input
                          type="text"
                          value={editingTag.name}
                          onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        />
                      ) : (
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-300 text-gray-700">
                          {tag.name}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        {editingTag && editingTag.id === tag._id ? (
                          <>
                            <button
                              className="text-white px-3 py-1 rounded-full transition-colors bg-blue-600 hover:bg-blue-700"
                              onClick={() => handleEdit(tag._id)}
                              title="Save Changes"
                            >
                              <FaSave />
                            </button>
                            <button
                              className="text-white px-3 py-1 rounded-full transition-colors bg-gray-500 hover:bg-gray-600"
                              onClick={() => setEditingTag(null)}
                              title="Cancel"
                            >
                              <FaTimes />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="text-white px-3 py-1 rounded-full transition-colors bg-blue-600 hover:bg-blue-700"
                              onClick={() => setEditingTag({ id: tag._id, name: tag.name })}
                              title="Edit Tag"
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="text-white px-3 py-1 rounded-full transition-colors bg-red-600 hover:bg-red-700"
                              onClick={() => handleDelete(tag._id)}
                              title="Delete Tag"
                            >
                              <FaTrashAlt />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="p-4 text-center text-gray-500">
                    No tags found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TagsAdmin;