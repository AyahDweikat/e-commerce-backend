import joi from "joi";
import { generalFeilds } from "../../Middleware/validation.js";


export const addCouponSchema = 
joi.object({
    name: joi.string().min(2).max(20).required(),
    amount: joi.number().positive().min(1).max(100),
    expireDate: joi.date(),
}).required()


export const getCouponSchema = 
joi.object({
    couponId: generalFeilds.id,
}).required()

export const updateCouponSchema = 
joi.object({
    couponId: generalFeilds.id,
    name: joi.string().min(2).max(20),
    amount: joi.number().positive().min(1).max(100),
    expireDate: joi.date(),
}).required()


