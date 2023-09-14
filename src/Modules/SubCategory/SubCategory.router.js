import { Router } from "express";
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js";
import * as SubCategoryController from "./Controller/SubCategory.controller.js";
import { asyncHandler } from "../../Services/errorHandling.js";
import * as validators from "./SubCategory.validation.js";
import validation from "../../Middleware/validation.js";
import { endPoint } from "../Category/Category.endpoint.js";
import { auth } from "../../Middleware/auth.middleware.js";
const router = Router({ mergeParams: true, caseSensitive:true});
router.post(
  "/addSubCategory",
  fileUpload(fileValidation.image).single("image"),
  validation(validators.addSubCategorySchema),
  SubCategoryController.addSubCategory
);
router.put(
  "/updateSubCategory/:subCategoryId",
  auth(endPoint.create),
  fileUpload(fileValidation.image).single("image"),
  validation(validators.updateSubCategorySchema),
  asyncHandler(SubCategoryController.updateSubCategory)
);
router.get(
  "/getSubCategory",
  asyncHandler(SubCategoryController.getSubCategory)
);
router.get(
  "/getAllSubCategories",
  asyncHandler(SubCategoryController.getAllSubCategories)
);
router.get(
  "/:subCategoryId/getProducts",
  asyncHandler(SubCategoryController.getProductsFromSubCategory)
);
export default router;
