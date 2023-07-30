import joi from "joi";
import { generalFeilds } from "../../Middleware/validation.js";


export const signupSchema = joi
  .object({
    userName: joi.string().alphanum().min(2).max(20).required().messages({
      "any.required": "username is required",
      "string.empty": "username is required",
    }),
    email: generalFeilds.email,
    password: generalFeilds.password,
    cPassword: joi.string().valid(joi.ref("password")).required(),
  })
  .required();

export const tokenSchema = joi
  .object({
    token: joi.string().required(),
  })
  .required();

export const loginSchema = joi
  .object({
    email: generalFeilds.email,
    password: generalFeilds.password,
  })
  .required();

export const sendCodeSchema = joi
  .object({
    email: generalFeilds.email,
  })
  .required();

export const forgetPasswordSchema = joi
  .object({
    code: joi.string().required(),
    email: generalFeilds.email,
    password: generalFeilds.password,
    cPassword: joi.string().valid(joi.ref("password")).required(),
  })
  .required();
