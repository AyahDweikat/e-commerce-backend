import * as dotenv from "dotenv";
import orderModel from "../../../../DB/model/Order.model.js";
import productModel from "../../../../DB/model/Product.model.js";
import reviewModel from "../../../../DB/model/Review.model.js";

export const addReview = async (req, res, next) => {
  const { productId } = req.params;
  const order = await orderModel.findOne({
    userId: req.user._id,
    status: "delivered",
    "products.productId": productId,
  });
  if (!order)
    return next(new Error(`Can not review this product`, { cause: 409 }));
  const checkReview = await reviewModel.findOne({
    createdBy: req.user._id,
    productId,
  });
  if (checkReview) {
    return next(
      new Error(`You have already reviewed this product`, { cause: 409 })
    );
  }
  // const reviews = await reviewModel.find({productId})
  // const sum = reviews?.reduce((acc, review) => acc +review.rating, 0)
  // const averageReview = sum/reviews?.length
  // return res.json({averageReview})
  const newReview = await reviewModel.create({
    ...req.body,
    createdBy: req.user._id,
    productId,
    orderId: order._id,
  });
  return res.status(201).json({
    message: "successfully added Review",
    newReview,
  });
};

export const updateReview = async (req, res, next) => {
  const { reviewId, productId } = req.params;
  const review = await reviewModel.findOneAndUpdate(
    { _id:reviewId, productId, createdBy:req.user._id},
    req.body,
    { new: true }
  );
  return res.status(201).json({
    message: "successfully added Review",
    review,
  });
};
