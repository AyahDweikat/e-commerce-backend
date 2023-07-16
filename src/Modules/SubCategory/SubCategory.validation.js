import joi from "joi";
import { generalFeilds } from "../../Middleware/validation.js";


export const addSubCategorySchema = 
joi.object({
    categoryId:generalFeilds.id,
    name: joi.string().min(2).max(20).required(),
    file: generalFeilds.file.required()
}).required()



export const updateSubCategorySchema = 
joi.object({
    categoryId: generalFeilds.id,
    subCategoryId: generalFeilds.id,
    name: joi.string().min(2).max(20),
    file: generalFeilds.file,
}).required()


export const getSubCategorySchema = 
joi.object({
    categoryId:generalFeilds.id
}).required()