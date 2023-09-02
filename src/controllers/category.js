import Category from "../modules/Category.js";
import { createError } from "../utils/error.js";

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();

    res.status(200).json(categories);
  } catch (err) {
    next(await createError(500, err, req, null));
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(200).json(category);
  } catch (err) {
    next(await createError(500, err, req, null));
  }
};

export const getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category)
      return next(createError(404, "Category not found!", req, null));

    res.status(200).json(category);
  } catch (err) {
    next(await createError(500, err, req, null));
  }
};

export const getCategoryByName = async (req, res, next) => {
  try {
    const name = req.params.name;
    const category = await Category.find({ name });

    if (!category)
      return next(await createError(404, "Category not found!", req, null));

    res.status(200).json(category);
  } catch (err) {
    next(await createError(500, err, req, null));
  }
};

export const addCategory = async (req, res, next) => {
  try {
    const category = new Category(req.body);
    const savedCategory = await category.save();

    res.status(201).json(savedCategory);
  } catch (err) {
    next(await createError(500, err, req, null));
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCategory)
      return next(await createError(404, "Category not found!", req, null));
    res.status(200).json(updatedCategory);
  } catch (err) {
    next(await createError(500, err, req, null));
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const deletedCategory = await Category.findByIdAndRemove(req.params.id);

    if (!deletedCategory)
      return next(await createError(404, "Category not found!", req, null));

    res.status(202).json({ message: "Category deleted successfully" });
  } catch (err) {
    next(await createError(500, err, req, null));
  }
};
