import joi from "joi";
import { generalFeilds } from "../../Middleware/validation.js";

export const addBrandSchema = 
joi.object({
    name: joi.string().min(2).max(20).required(),
    file: generalFeilds.file.required(), 
    categoryId:generalFeilds.id.required()
}).required()



export const updateBrandSchema = 
joi.object({
    brandId:generalFeilds.id,
    name: joi.string().min(2).max(20),
    file: generalFeilds.file,
    categoryId:generalFeilds.id
}).required()


export const getBrandSchema = 
joi.object({
    brandId:generalFeilds.id,
    categoryId:generalFeilds.id
}).required()