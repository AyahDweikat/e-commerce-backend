import { Router } from "express";
import * as BrandController from "./Controller/brand.controller.js";
import * as validators from "./brand.validation.js";
import SubCategoryRouter from "../SubCategory/SubCategory.router.js";
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js";
import { asyncHandler } from "../../Services/errorHandling.js";
import validation from "../../Middleware/validation.js";

const router = Router();
router.use("/:categoryId/subCategory", SubCategoryRouter);
router.post(
  "/addBrand",
  fileUpload(fileValidation.image).single("image"),
  validation(validators.addBrandSchema),
  asyncHandler(BrandController.addBrand)
);
router.get(
  "/getBrand/:brandId",
  validation(validators.getBrandSchema),
  asyncHandler(BrandController.getBrand)
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
