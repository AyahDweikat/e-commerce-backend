import { Router } from "express";
import * as BrandController from "./Controller/brand.controller.js";
import * as validators from "./brand.validation.js";
import SubCategoryRouter from "../SubCategory/SubCategory.router.js";
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js";
import { asyncHandler } from "../../Services/errorHandling.js";
import validation from "../../Middleware/validation.js";
import { endPoint } from "../Category/Category.endpoint.js";
import { auth } from "../../Middleware/auth.middleware.js";

const router = Router({caseSensitive:true});
router.use("/:categoryId/subCategory", SubCategoryRouter);
router.post(
  "/addBrand",
  auth(endPoint.create),
  fileUpload(fileValidation.image).single("image"),
  validation(validators.addBrandSchema),
  asyncHandler(BrandController.addBrand)
);



router.patch(
  "/updateBrand/:brandId",
  auth(endPoint.update),
  validation(validators.updateBrandSchema),
  // BrandController.updateBrand
  asyncHandler(BrandController.updateBrand)
);




router.get("/getBrands/:categoryId", asyncHandler(BrandController.getBrands));
router.get("/getAllBrands", asyncHandler(BrandController.getAllBrands));
// router.put(
//   "/updateBrand/:brandId",
//   fileUpload(fileValidation.image).single("image"),
//   validation(validators.updateBrandSchema),
//   asyncHandler(BrandController.updateBrand)
// );
export default router;
