import * as dotenv from "dotenv";

// import subCategoryModel from "../../../../DB/model/SubCategory.model.js";
// import brandModel from "./../../../../DB/model/Brand.model.js";
import productModel from "./../../../../DB/model/Product.model.js";
import cartModel from "../../../../DB/model/Cart.model.js";
// import categoryModel from "./../../../../DB/model/Category.model.js";

export const addProductToCart = async (req, res, next) => {
  const {productId, qty} = req.body;

  const product = await productModel.findOne({
    _id: productId,
  });
  if(!product) return next(new Error(`Invalid Product Id`, { cause: 400 }));
  if(product.stock < qty) return next(new Error(`Invalid Product Quantity`, { cause: 400 }));
  const cart = await cartModel.findOne({userId: req.user._id})
  if(!cart){
    const newCart = await cartModel.create({
      userId: req.user._id,
      products:[{productId, qty}]
    })
    return res
      .status(201)
      .json({ message: "successfully added Cart", newCart});
  }
  else {
    let productMatch = false
    for(let i =0; i<cart.products.length; i++){
      if(cart.products[i].productId.toString() == productId){
        cart.products[i].qty = qty;
        productMatch=true;
        break;
      }
    }
    if(!productMatch){
     cart.products.push({productId, qty}) 
    }
    let updatedCart = await cart.save()
    res.json({updatedCart})
  }
};




// export const updateProduct = async (req, res, next) => {
//   const { productId } = req.params;
//   const product = await productModel.findOne({ _id: productId });
//   if (!product) return next(new Error(`Invalid Product Id`, { cause: 400 }));

//   const { name, price, discount, categoryId, subCategoryId, brandId } =
//     req.body;
//   if (categoryId && subCategoryId) {
//     const checkSubCategory = await subCategoryModel.findOne({
//       _id: subCategoryId || product.subCategoryId,
//       categoryId,
//     });
//     if (!checkSubCategory) return next(new Error(`Invalid SubCategory`, { cause: 409 }));
//     product.categoryId = categoryId;
//     product.subCategoryId = subCategoryId;
//   } 
//   else if (subCategoryId) {
//     const checkSubCategory = await subCategoryModel.findOne({
//       _id: subCategoryId,
//     });
//     if (!checkSubCategory)
//       return next(new Error(`Invalid SubCategory`, { cause: 409 }));
//     product.subCategoryId = subCategoryId;
//   }
//   if(brandId) {
//     const checkBrand = await brandModel.findOne({
//       _id: brandId,
//     });
//     if (!checkBrand) return next(new Error(`Invalid Brand`, { cause: 409 }));
//     product.brandId = brandId;
//   }
//   if(name){
//     product.name = name
//     product.slug = slugify(name)
//   }
//   if(req.body.stock){
//     product.stock = req.body.stock
//   }
//   if(req.body.description){
//     product.description = req.body.description
//   }
//   if(req.body.colors){
//     product.colors = req.body.colors
//   }
//   if(req.body.sizes){
//     product.sizes = req.body.sizes
//   }

//   if(price && discount){
//     product.price = price
//     product.discount = discount
//     product.finalPrice = price * (1-(discount || 0))
//   }
//   else if(price){
//     product.price = price
//     product.finalPrice = price * ( 1- product.discount)
//   }
//   else if(discount){
//     product.discount = discount
//     product.finalPrice = product.price * (1 - discount)
//   }
//   if(req.files.mainImage.length){
//     const { public_id, secure_url } = await cloudinary.uploader.upload(
//       req.files.mainImage[0].path,
//       { folder: `${process.env.APP_NAME}/product/mainImage` }
//     );
//     await cloudinary.uploader.destroy(product.mainImage.public_id);
//     product.mainImage.secure_url = secure_url;
//     product.mainImage.public_id = public_id;
//   }
//   if(req.files.subImages.length){
//     const subImages = [];
//     for (const file of product.subImages) {
//     await cloudinary.uploader.destroy(file.public_id);
//     }
//     for (const file of req.files.subImages) {
//       const { public_id, secure_url } = await cloudinary.uploader.upload(
//         file.path,
//         { folder: `${process.env.APP_NAME}/product/subImages` }
//       );
//       subImages.push({ public_id, secure_url });
//     }
//     product.subImages = subImages;
//   }
//     product.updatedBy = req.user._id;
//     const updatedProduct = await product.save();
//     if(!updatedProduct) next(new Error(`Fail to update Product`, { cause: 409 }));
//   return res.json({ message: "Product updated successfully", product });
// };
