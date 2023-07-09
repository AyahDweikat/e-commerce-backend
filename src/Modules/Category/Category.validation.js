import joi from "joi";
import { generalFeilds } from "../../Middleware/validation.js";

export const addCategorySchema = 
joi.object({
    name: joi.string().min(2).max(20).required(),
    file: generalFeilds.file.required()
}).required()