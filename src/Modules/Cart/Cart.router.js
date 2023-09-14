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
router.get(
  "/getCart",
  auth(endPoint.get),
  asyncHandler(CartController.getCart)
);


router.patch(
  "/clearCart",
  auth(endPoint.update),
  asyncHandler(CartController.clearCart)
);
router.patch(
  "/deleteItemFromCart/",
  auth(endPoint.update),
  asyncHandler(CartController.deleteItemFromCart)
);
export default router;
