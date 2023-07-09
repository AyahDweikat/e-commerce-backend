import {Router} from 'express';
import fileUpload, { fileValidation } from '../../Services/multerCloudinary.js';
import * as CategoryController from './Controller/Category.controller.js'
import { asyncHandler } from '../../Services/errorHandling.js';
import * as  validators  from './Category.validation.js';
import validation from '../../Middleware/validation.js';


const router =Router();
router.post('/addCategory', fileUpload(fileValidation.image).single('image'), validation(validators.addCategorySchema) ,asyncHandler(CategoryController.addCategory));



export default router;