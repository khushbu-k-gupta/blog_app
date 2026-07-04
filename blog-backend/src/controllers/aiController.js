import fetch from "node-fetch";
import Post from "../models/Post.js";

export const generatePost = async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) return res.status(400).json({ message: "Topic is required" });

    const body = JSON.stringify({
      contents: [
        { parts: [{ text: `Write a detailed blog post on "${topic}" in 100-250 words.` }] }
      ]
    });

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": process.env.GOOGLE_API_KEY
        },
        body
      }
    );

    const data = await response.json();

    const content =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "No content generated";

    const post = await Post.create({
      title: topic,
      content,
      author: req.user._id
    });

    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gemini AI post generation failed" });
  }
};

export const suggestTags = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) return res.status(400).json({ message: "Content is required" });

    const body = JSON.stringify({
      contents: [
        { parts: [{ text: `Suggest 3-5 tags for this blog post content: "${content}"` }] }
      ]
    });

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": process.env.GOOGLE_API_KEY
        },
        body
      }
    );

    const data = await response.json();

    const tagsText = data?.candidates?.[0]?.content?.[0]?.text || "";
    const tags = tagsText.split(",").map(tag => tag.trim());

    res.json({ tags });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gemini AI tag suggestion failed" });
  }
};
