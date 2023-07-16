import { Router } from "express";
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js";
import * as SubCategoryController from "./Controller/SubCategory.controller.js";
import { asyncHandler } from "../../Services/errorHandling.js";
import * as validators from "./SubCategory.validation.js";
import validation from "../../Middleware/validation.js";

const router = Router({ mergeParams: true });

router.post(
  "/addSubCategory",
  fileUpload(fileValidation.image).single("image"),
  asyncHandler(SubCategoryController.addSubCategory)
);
// router.post('/addSubCategory', fileUpload(fileValidation.image).single('image'), validation(validators.addSubCategorySchema) ,asyncHandler(SubCategoryController.addSubCategory));
// router.put('/updateSubCategory/:categoryId', fileUpload(fileValidation.image).single('image'), validation(validators.SubCategoryController) ,asyncHandler(CategoryController.updateCategory))
// router.get('/getSubCategory/:categoryId', validation(validators.getCategorySchema), asyncHandler(SubCategoryController.getCategory))
// router.get('/getAllSubCategories', asyncHandler(SubCategoryController.getAllCategories))

export default router;
