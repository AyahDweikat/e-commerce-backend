import { Router } from "express";
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js";
import * as ProductController from "./Controller/product.controller.js";
import * as validators from "./product.validation.js";
import validation from "../../Middleware/validation.js";
import { asyncHandler } from "../../Services/errorHandling.js";
import { auth } from "../../Middleware/auth.middleware.js";
import { endPoint } from "./Product.endpoint.js";

const router = Router({caseSensitive:true});
router.post(
  "/addProduct",
  auth(endPoint.create),
  fileUpload(fileValidation.image).fields([
    {name:"mainImage", maxCount:1},
    {name:"subImages", maxCount:5},
]),
  // validation(validators.addProductSchema),
  asyncHandler(ProductController.addProduct)
);
// router.get(
//   "/getProduct/:productId",
//   // validation(validators.getProductSchema),
//   asyncHandler(ProductController.getProduct)
// );
// router.get("/getProducts/:categoryId", asyncHandler(ProductController.getProducts));
// router.get("/getAllProducts", asyncHandler(ProductController.getAllProducts));
// router.put(
//   "/updateProduct/:productId",
//   fileUpload(fileValidation.image).single("image"),
//   validation(validators.updateProductSchema),
//   asyncHandler(ProductController.updateProduct)
// );
export default router;
