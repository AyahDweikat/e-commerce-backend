import mongoose, { Schema, Types, model } from "mongoose";
const orderSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    products: [
      {
        productId: { type: Types.ObjectId, ref: "Product", required: true },
        qty: { type: Number, default: 1, required: true },
        unitPrice: { type: Number, required: true },
        finalPrice: { type: Number, required: true },
      },
    ],
    address: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    couponId: {
      type: Types.ObjectId,
      ref: "Coupon",
    },
    subTotal: { type: Number, required: true },
    finalPrice: { type: Number, required: true },
    paymentType: {
      type: String,
      dafault: 'cash',
      enum: ['cash', 'card'],
    },
    status: {
      type: String,
      dafault: 'pending',
      enum: ['pending', 'canceled', 'approved', 'onWay', 'delivered'],
    },
    reasonRejected: {type: String},
    note: {type: String},
    updatedBy: { type: Types.ObjectId, ref: "User"},
  },
  {
    timestamps: true,
  }
);
const orderModel = mongoose.models.Order || model("Order", orderSchema);
export default orderModel;
