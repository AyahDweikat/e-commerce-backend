import slugify from "slugify";
import cloudinary from "../../../Services/cloudinary.js";
import * as dotenv from "dotenv";
import subCategoryModel from "../../../../DB/model/SubCategory.model.js";
dotenv.config();

export const addSubCategory = async (req, res, next) => {
  res.json({ id: req.params.categoryId });
  const { name } = req.body;
  if (await subCategoryModel.findOne({ name })) {
    return next(new Error(`Duplicate Category name ${name}`, { cause: 409 }));
  }
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${process.env.APP_NAME}/category` }
  );
  const newCategory = await subCategoryModel.create({
    name,
    slug: slugify(name),
    image: { public_id, secure_url },
    createdBy: {},
  });
  return res
    .status(201)
    .json({ message: "successfully added Category", newCategory });
};

// export const updateCategory = async(req, res, next)=>{
//     const category = await subCategoryModel.findById(req.params.categoryId)
//     if(!category) return next(new Error(`Invalid Category Id`, {cause:400}))
//     if(req.body.name) {
//         if(category.name === req.body.name) return next(new Error(`Old name match new name`, {cause:409}))
//         if(await subCategoryModel.findOne({name:req.body.name})) return next(new Error(`Invalid Category name`, {cause:409}))
//         category.name = req.body.name;
//         req.body.slug =slugify(req.body.name)
//     }
//     if(req.file){
//         const {public_id, secure_url} = await cloudinary.uploader.upload(req.file.path, {folder:`${process.env.APP_NAME}/category`})
//         await cloudinary.uploader.destroy(category.image.public_id)
//         req.body.image = {public_id, secure_url}
//     }

//     await category.save()
//     return res.json({message:"Categoryupdated successfully", category})
// }

// export const getCategory = async(req, res, next)=>{
//     const category = await subCategoryModel.findById(req.params.categoryId)
//     if(!category) return next(new Error(`Invalid Category Id`, {cause:400}))
//     return res.status(200).json({message:"Category data", results: category})
// }

// export const getAllCategories = async(req, res)=>{
//     const categories =  await subCategoryModel.find()
//     return res.status(200).json({message:"get all Categories", results: categories})
// }
