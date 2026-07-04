import axios from "./axios";

export const getAllPosts = async () => {
  const res = await axios.get("/posts");
  return res.data;
};

export const createPost = async (postData) => {
  const res = await axios.post("/posts", postData);
  return res.data;
};

export const editPost = async (id, postData) => {
  const res = await axios.put(`/posts/${id}`, postData);
  return res.data;
};

export const deletePost = async (id) => {
  const res = await axios.delete(`/posts/${id}`);
  return res.data;
};
