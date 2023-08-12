import { Router } from "express";
import * as CartController from "./Controller/Cart.controller.js";
import { auth } from "../../Middleware/auth.middleware.js";
// import * as validators from "./product.validation.js";
import { asyncHandler } from './../../Services/errorHandling.js';
import { endPoint } from "./Cart.endpoint.js";
import validation from "../../Middleware/validation.js";

const router = Router({ caseSensitive: true });
router.post(
  "/addProductToCart",
  auth(endPoint.create),
  // validation(validators.addProductSchema),
  asyncHandler(CartController.addProductToCart)
);

export default router;
