import { Router } from "express";
import * as OrderController from "./Controller/order.controller.js";
import * as validators from "./order.validation.js";
import validation from "../../Middleware/validation.js";
import { asyncHandler } from './../../Services/errorHandling.js';
import { endPoint } from './order.endpoint.js';
import { auth } from "../../Middleware/auth.middleware.js";

const router = Router({caseSensitive:true});

router.post(
  "/addOrder",
  auth(endPoint.create),
  // validation(validators.addCouponSchema),
  asyncHandler(OrderController.addOrder)
);
router.post(
  "/addAllToOrder",
  auth(endPoint.create),
  // validation(validators.addCouponSchema),
  asyncHandler(OrderController.addAllToOrder)
);


router.patch(
  "/cancelOrder/:orderId",
  auth(endPoint.cancel),
  // validation(validators.addCouponSchema),
  asyncHandler(OrderController.cancelOrder)
);


router.patch(
  "/changeOrderState/:orderId",
  auth(endPoint.changeStatus),
  // validation(validators.addCouponSchema),
  asyncHandler(OrderController.changeOrderState)
);

export default router;
