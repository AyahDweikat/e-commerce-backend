import joi from "joi";
import { generalFeilds } from "../../Middleware/validation.js";

export const addProductSchema = 
joi.object({
    name: joi.string().min(2).max(20).required(),
    file: generalFeilds.file.required(), 
    categoryId:generalFeilds.id.required()
}).required()



export const updateProductSchema = 
joi.object({
    brandId:generalFeilds.id,
    name: joi.string().min(2).max(20),
    file: generalFeilds.file,
    categoryId:generalFeilds.id
}).required()


export const getProductSchema = 
joi.object({
    brandId:generalFeilds.id,
    categoryId:generalFeilds.id
}).required()