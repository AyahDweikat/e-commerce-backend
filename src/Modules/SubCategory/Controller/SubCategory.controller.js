import slugify from "slugify";
import cloudinary from "../../../Services/cloudinary.js";
import * as dotenv from "dotenv";
import subCategoryModel from "../../../../DB/model/SubCategory.model.js";
import { asyncHandler } from "../../../Services/errorHandling.js";
import productModel from "../../../../DB/model/Product.model.js";
dotenv.config();

export const addSubCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const { categoryId } = req.params;
  if (await subCategoryModel.findOne({ name })) {
    return next(
      new Error(`Duplicate SubCategory name ${name}`, { cause: 409 })
    );
  }
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${process.env.APP_NAME}/subCategory` }
  );
  const newSubCategory = await subCategoryModel.create({
    name,
    categoryId,
    slug: slugify(name),
    image: { public_id, secure_url },
    // createdBy:req.user?._id,
    // updatedBy: req.user?._id
  });
  return res
    .status(201)
    .json({ message: "successfully added SubCategory", newSubCategory });
});






export const updateSubCategory = async (req, res, next) => {
  const { categoryId, subCategoryId } = req.params;
  const subCategory = await subCategoryModel.findOne({
    _id: subCategoryId,
    categoryId,
  });
  if (!subCategory)
    return next(new Error(`Invalid SubCategory Id`, { cause: 400 }));
  if (req.body.name) {
    if (subCategory.name === req.body.name)
      return next(new Error(`Old name match new name`, { cause: 409 }));
    if (await subCategoryModel.findOne({ name: req.body.name }))
      return next(new Error(`Invalid Category name`, { cause: 409 }));
    subCategory.name = req.body.name;
    subCategory.slug = slugify(req.body.name);
  }
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `${process.env.APP_NAME}/subCategory` }
    );
    await cloudinary.uploader.destroy(subCategory.image.public_id);
    subCategory.image = { public_id, secure_url };
  }
  subCategory.updatedBy = req.user._id;
  await subCategory.save();
  return res.json({ message: "SubCategory updated successfully", subCategory });
};




export const getSubCategory = async (req, res, next) => {
  const { categoryId } = req.params;
  const subCategoriesForCategory = await subCategoryModel.find({ categoryId });
  return res.status(200).json({
    message: "Getting SubCategories for Specific Category successfully",
    subCategoriesForCategory,
  });
};
export const getAllSubCategories = async (req, res, next) => {
  const subCategoriesForCategory = await subCategoryModel.find().populate({
    path: "categoryId",
    select: "name image",
  });
  return res.status(200).json({
    message: "Getting SubCategories for Specific Category successfully",
    subCategoriesForCategory,
  });
};

export const getProductsFromSubCategory = async (req, res, next) => {
  const { subCategoryId } = req.params;
  const specificProducts = await subCategoryModel
    .findById(subCategoryId)
    .populate({
      path:"products",
      match: {isDeleted: {$eq:false}}
  });
  res.status(200).json({message:"Products", specificProducts });
};
