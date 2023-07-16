import { Router } from "express";
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js";
import * as CategoryController from "./Controller/Category.controller.js";
import { asyncHandler } from "../../Services/errorHandling.js";
import * as validators from "./Category.validation.js";
import validation from "../../Middleware/validation.js";
import SubCategoryRouter from "../SubCategory/SubCategory.router.js";

const router = Router();
router.use("/:categoryId/subCategory", SubCategoryRouter);
router.post(
  "/addCategory",
  fileUpload(fileValidation.image).single("image"),
  validation(validators.addCategorySchema),
  asyncHandler(CategoryController.addCategory)
);
router.put(
  "/updateCategory/:categoryId",
  fileUpload(fileValidation.image).single("image"),
  validation(validators.updateCategorySchema),
  asyncHandler(CategoryController.updateCategory)
);
router.get(
  "/getCategory/:categoryId",
  validation(validators.getCategorySchema),
  asyncHandler(CategoryController.getCategory)
);
router.get(
  "/getAllCategories",
  asyncHandler(CategoryController.getAllCategories)
);
export default router;
