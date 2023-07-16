import { Router } from "express";
import * as CouponController from "./Controller/coupon.controller.js";
import * as validators from "./coupon.validation.js";
import { asyncHandler } from "../../Services/errorHandling.js";
import validation from "../../Middleware/validation.js";

const router = Router();

router.post(
  "/addCoupon",
  validation(validators.addCouponSchema),
  asyncHandler(CouponController.addCoupon)
);
router.get("/getCoupons", asyncHandler(CouponController.getCoupons));
router.get(
  "/getCouponData/:couponId",
  validation(validators.getCouponSchema),
  asyncHandler(CouponController.getCouponData)
);

router.put(
  "/updateCoupon/:couponId",
  validation(validators.updateCouponSchema),
  asyncHandler(CouponController.updateCoupon)
);
export default router;
