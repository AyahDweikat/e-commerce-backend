import subCategoryModel from "../../../../DB/model/SubCategory.model.js";
import cloudinary from "../../../Services/cloudinary.js";
import brandModel from "./../../../../DB/model/Brand.model.js";
import * as dotenv from "dotenv";
import productModel from "./../../../../DB/model/Product.model.js";
import slugify from "slugify";
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
  req.body.mainImage = { public_id, secure_url};
  if(req.files.subImages){
    req.body.subImages = []
    for(const file of req.files.subImages){
        const { public_id, secure_url } = await cloudinary.uploader.upload(
            file.path,
            { folder: `${process.env.APP_NAME}/product/subImages` }
          );
        req.body.subImages.push({public_id, secure_url})
    }
  }
  req.body.createdBy = req.user._id;
  req.body.updatedBy = req.user._id;
  const newProduct = await productModel.create(req.body);
  if(!newProduct) next(new Error(`Fail to add Product`, { cause: 409 }));
  return res.status(201).json({message:"successfully added Product", newProduct})
};

// export const getProduct = async(req, res, next) =>{
//     const {productId} = req.params;
//     const brands = await brandModel.find({categoryId})
//     res.json({test:"Getting brands successfully", brands})
// }

export const getProducts = async (req, res, next) => {
  const { categoryId } = req.params;
  const brands = await brandModel.find({ categoryId });
  res.json({ test: "Getting brands successfully", brands });
};
export const getAllProducts = async (req, res, next) => {
  const brands = await brandModel.find();
  res.json({ test: "Getting All brands successfully", brands });
};

export const updateProduct = async (req, res, next) => {
  const brand = await brandModel.findById(req.params.brandId);
  if (!brand) return next(new Error(`Invalid Brand Id`, { cause: 400 }));
  if (req.body.name) {
    if (brand.name === req.body.name)
      return next(new Error(`Old name match new name`, { cause: 409 }));
    if (await brandModel.findOne({ name: req.body.name }))
      return next(new Error(`Invalid Brand name`, { cause: 409 }));
    brand.name = req.body.name;
  }
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `${process.env.APP_NAME}/brand` }
    );
    await cloudinary.uploader.destroy(brand.image.public_id);
    brand.image = { public_id, secure_url };
  }
  if (req.body.categoryId) {
    if (brand.categoryId === req.body.categoryId)
      return next(new Error(`Old name match new name`, { cause: 409 }));
    brand.categoryId = req.body.categoryId;
  }
  brand.updatedBy = req.user._id;
  await brand.save();
  return res.json({ message: "Brand updated successfully", brand });
};
