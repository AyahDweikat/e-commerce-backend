import * as dotenv from "dotenv";
import productModel from "./../../../../DB/model/Product.model.js";
import cartModel from "../../../../DB/model/Cart.model.js";

export const addProductToCart = async (req, res, next) => {
  const { productId, qty } = req.body;
  const product = await productModel.findOne({
    _id: productId,
  });
  if (!product) return next(new Error(`Invalid Product Id`, { cause: 400 }));
  if (product.stock < qty)
    return next(new Error(`Invalid Product Quantity`, { cause: 400 }));
  const cart = await cartModel.findOne({ userId: req.user._id });
  if (!cart) {
    const newCart = await cartModel.create({
      userId: req.user._id,
      products: [{ productId, qty }],
    });
    return res
      .status(201)
      .json({ message: "successfully added Cart", newCart });
  } else {
    let productMatch = false;
    for (let i = 0; i < cart.products.length; i++) {
      if (cart.products[i].productId.toString() == productId) {
        cart.products[i].qty = qty;
        productMatch = true;
        break;
      }
    }
    if (!productMatch) {
      cart.products.push({ productId, qty });
    }
    let updatedCart = await cart.save();
    res.json({ updatedCart });
  }
};

export const deleteItemFromCart = async (req, res, next) => {
  const { productIds } = req.body;
  const updatedCart = await cartModel.updateOne(
    { userId: req.user._id },
    {
      $pull: {
        products: {
          productId: { $in: productIds },
        },
      },
    }
  );
  res.json({ updatedCart });
};

export const clearCart = async (req, res, next) => {
  const updatedCart = await cartModel.updateOne(
    { userId: req.user._id },
    { products:[]}
  );
  res.json({ updatedCart });
};

export const getCart = async (req, res, next) => {
  const cart = await cartModel.findOne({ userId: req.user._id });
  if(!cart) next(new Error(`No Cart For This User`, { cause: 400 }));
  return res.json({ cart });
};
