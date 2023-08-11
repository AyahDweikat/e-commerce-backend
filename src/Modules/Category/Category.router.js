import { Router } from "express";
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js";
import * as CategoryController from "./Controller/Category.controller.js";
import { asyncHandler } from "../../Services/errorHandling.js";
import * as validators from "./Category.validation.js";
import validation from "../../Middleware/validation.js";
import SubCategoryRouter from "../SubCategory/SubCategory.router.js";
import { auth, roles } from "../../Middleware/auth.middleware.js";
import { endPoint } from './Category.endpoint.js';

const router = Router({caseSensitive:true});
router.use("/:categoryId/subCategory", SubCategoryRouter);
router.post(
  "/addCategory",
  auth(endPoint.create),
  fileUpload(fileValidation.image).single("image"),
  validation(validators.addCategorySchema),
  asyncHandler(CategoryController.addCategory)
);
router.put(
  "/updateCategory/:categoryId",
  auth(endPoint.update),
  fileUpload(fileValidation.image).single("image"),
  validation(validators.updateCategorySchema),
  asyncHandler(CategoryController.updateCategory)
);
router.get(
  "/getCategory/:categoryId",
  auth(endPoint.get),
  validation(validators.getCategorySchema),
  asyncHandler(CategoryController.getCategory)
);
router.get(
  "/getAllCategories",
  auth(Object.values(roles)),
  asyncHandler(CategoryController.getAllCategories)
);
export default router;
