import subCategoryModel from "../../../../DB/model/SubCategory.model.js";
import brandModel from "./../../../../DB/model/Brand.model.js";
import cloudinary from "./../../../Services/cloudinary.js";
import productModel from "./../../../../DB/model/Product.model.js";
import * as dotenv from "dotenv";
import categoryModel from "./../../../../DB/model/Category.model.js";
import slugify from "slugify";
import { pagination } from "../../../Services/pagination.js";

export const addProduct = async (req, res, next) => {
  const { name, price, discount, categoryId, subCategoryId, brandId } =
    req.body;
    const checkCategory = await subCategoryModel.findOne({
      _id: subCategoryId,
    categoryId,
  });
  const checkBrand = await brandModel.findOne({ _id: brandId });
  if (!checkCategory)
    return next(new Error(`Invalid Category Or SubCategory`, { cause: 409 }));
  if (!checkBrand) return next(new Error(`Invalid Brand`, { cause: 409 }));
  req.body.slug = slugify(name);
  req.body.finalPrice = price * (1 - (discount || 0));
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.files.mainImage[0].path,
    { folder: `${process.env.APP_NAME}/product/mainImage` }
  );
  req.body.mainImage = { public_id, secure_url };
  if (req.files.subImages) {
    req.body.subImages = [];
    for (const file of req.files.subImages) {
      const { public_id, secure_url } = await cloudinary.uploader.upload(
        file.path,
        { folder: `${process.env.APP_NAME}/product/subImages` }
      );
      req.body.subImages.push({ public_id, secure_url });
    }
  }
  req.body.createdBy = req.user._id;
  req.body.updatedBy = req.user._id;
  const newProduct = await productModel.create(req.body);
  if (!newProduct) next(new Error(`Fail to add Product`, { cause: 409 }));
  return res
    .status(201)
    .json({ message: "successfully added Product", newProduct });
};
export const updateProduct = async (req, res, next) => {
  const { productId } = req.params;
  const product = await productModel.findOne({ _id: productId });
  if (!product) return next(new Error(`Invalid Product Id`, { cause: 400 }));

  const { name, price, discount, categoryId, subCategoryId, brandId } =
    req.body;
  if (categoryId && subCategoryId) {
    const checkSubCategory = await subCategoryModel.findOne({
      _id: subCategoryId || product.subCategoryId,
      categoryId,
    });
    if (!checkSubCategory) return next(new Error(`Invalid SubCategory`, { cause: 409 }));
    product.categoryId = categoryId;
    product.subCategoryId = subCategoryId;
  } 
  else if (subCategoryId) {
    const checkSubCategory = await subCategoryModel.findOne({
      _id: subCategoryId,
    });
    if (!checkSubCategory)
      return next(new Error(`Invalid SubCategory`, { cause: 409 }));
    product.subCategoryId = subCategoryId;
  }
  if(brandId) {
    const checkBrand = await brandModel.findOne({
      _id: brandId,
    });
    if (!checkBrand) return next(new Error(`Invalid Brand`, { cause: 409 }));
    product.brandId = brandId;
  }
  if(name){
    product.name = name
    product.slug = slugify(name)
  }
  if(req.body.stock){
    product.stock = req.body.stock
  }
  if(req.body.description){
    product.description = req.body.description
  }
  if(req.body.colors){
    product.colors = req.body.colors
  }
  if(req.body.sizes){
    product.sizes = req.body.sizes
  }

  if(price && discount){
    product.price = price
    product.discount = discount
    product.finalPrice = price * (1-(discount || 0))
  }
  else if(price){
    product.price = price
    product.finalPrice = price * ( 1- product.discount)
  }
  else if(discount){
    product.discount = discount
    product.finalPrice = product.price * (1 - discount)
  }
  if(req.files.mainImage.length){
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.files.mainImage[0].path,
      { folder: `${process.env.APP_NAME}/product/mainImage` }
    );
    await cloudinary.uploader.destroy(product.mainImage.public_id);
    product.mainImage.secure_url = secure_url;
    product.mainImage.public_id = public_id;
  }
  if(req.files.subImages.length){
    const subImages = [];
    for (const file of product.subImages) {
    await cloudinary.uploader.destroy(file.public_id);
    }
    for (const file of req.files.subImages) {
      const { public_id, secure_url } = await cloudinary.uploader.upload(
        file.path,
        { folder: `${process.env.APP_NAME}/product/subImages` }
      );
      subImages.push({ public_id, secure_url });
    }
    product.subImages = subImages;
  }
    product.updatedBy = req.user._id;
    const updatedProduct = await product.save();
    if(!updatedProduct) next(new Error(`Fail to update Product`, { cause: 409 }));
  return res.json({ message: "Product updated successfully", product });
};
export const softDeleteProduct = async (req, res, next) => {
  const {productId} = req.params;
  const product = await productModel.findOneAndUpdate({_id: productId, isDeleted:false}, {isDeleted:true}, {new:true})
  if(!product){
    return next(new Error(`Fail to delete Product`, { cause: 409 }));
  }
  return res.json({message: "Success Soft Delete For Product", product})
}
export const forceDeleteProduct = async (req, res, next) => {
  const {productId} = req.params;
  const product = await productModel.findOneAndDelete({_id: productId, isDeleted:true})
  if(!product){
    return next(new Error(`Fail to delete Product`, { cause: 409 }));
  }
  return res.json({message: "Success Delete for Product", product})
}
export const restoreDeletedProduct = async (req, res, next) => {
  const {productId} = req.params;
  const product = await productModel.findOneAndUpdate({_id: productId, isDeleted:true}, {isDeleted:false}, {new:true})
  if(!product){
    return next(new Error(`Fail to restore Product`, { cause: 409 }));
  }
  return res.json({message: "Success to restore Product", product})
}
export const getSoftDeletedProducts = async (req, res, next) => {
  const products = await productModel.find({isDeleted:true})
  if(!products){
    return next(new Error(`Error to get Soft Deleted Products`, { cause: 409 }));
  }
  return res.json({message: "Success to get Soft Deleted Product", products})
}
export const getProductInfo = async (req, res, next) => {
  const {productId} = req.params;
  const product = await productModel.findOne({_id: productId}).populate('reviews')
  if(!product){
    return next(new Error(`Error to get Product`, { cause: 409 }));
  }
  return res.json({message: "Success to get Product", product})
}





export const getAllProducts = async (req, res, next) => {
  let {page, size} = req.query;
  const {skip, limit} = pagination(page, size)
  const allProducts = await productModel.find().limit(limit).skip(skip)
  if(!allProducts){
    return next(new Error(`Error to get All Products`, { cause: 409 }));
  }
  return res.json({message: "Success to get All Products", allProducts})
}