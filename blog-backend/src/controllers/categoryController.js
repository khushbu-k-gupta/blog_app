import Category from "../models/Category.js";

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const exists = await Category.findOne({ name });

    if (exists) {
      return res.status(400).json({
        message: "Category already exists",
      });
    }

    const category = await Category.create({
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
    });

    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort("name");

    res.json(categories);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    category.name = name;
    category.slug = name.toLowerCase().replace(/\s+/g, "-");

    await category.save();

    res.json(category);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);

    res.json({
      message: "Category deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};