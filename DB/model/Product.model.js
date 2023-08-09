import mongoose, { Schema, Types, model } from "mongoose";
const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    stock: {
      type: Number,
      default: 1,
    },
    price: {
      type: Number,
      default: 1,
    },
    finalPrice: {
      type: Number,
      default: 1,
    },
    discount: {
      type: Number,
      default: 0,
    },
    colors: [String],
    sizes: [{ type: String, enum: ["s", "m", "lg", "xl"] }],
    
    
    
    mainImage: {
      type: Object,
      required: true,
    },
    subImages: {
      type: Object,
    },


    categoryId: {
      type: Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategoryId: {
      type: Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
    brandId: {
      type: Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    createdBy: { type: Types.ObjectId, ref: "User", required: true }, // required true after prototype
    updatedBy: { type: Types.ObjectId, ref: "User", required: true }, // required true after prototype
  },
  {
    timestamps: true,
  }
);
const productModel = mongoose.models.Product || model("Product", productSchema);
export default productModel;
