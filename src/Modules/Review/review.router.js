import { Router } from "express";
import * as ReviewController from "./Controller/review.controller.js";
import * as validators from "./review.validation.js";
import validation from "../../Middleware/validation.js";
import { asyncHandler } from "../../Services/errorHandling.js";
import { auth } from "../../Middleware/auth.middleware.js";
import { endPoint } from "./review.endpoint.js";

const router = Router({ caseSensitive: true, mergeParams:true });



router.post(
  "/addReview",
  auth(endPoint.create),
  // validation(validators.addProductSchema),
  asyncHandler(ReviewController.addReview)
);

router.patch(
  "/updateReview/:reviewId",
  auth(endPoint.update),
  // validation(validators.addProductSchema),
  asyncHandler(ReviewController.updateReview)
);
export default router;
