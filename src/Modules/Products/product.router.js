import { Router } from "express";
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js";
import * as ProductController from "./Controller/product.controller.js";
import * as validators from "./product.validation.js";
import validation from "../../Middleware/validation.js";
import { asyncHandler } from "../../Services/errorHandling.js";
import { auth } from "../../Middleware/auth.middleware.js";
import { endPoint } from "./Product.endpoint.js";

const router = Router({ caseSensitive: true });
router.post(
  "/addProduct",
  auth(endPoint.create),
  fileUpload(fileValidation.image).fields([
    { name: "mainImage", maxCount: 1 },
    { name: "subImages", maxCount: 5 },
  ]),
  // validation(validators.addProductSchema),
  asyncHandler(ProductController.addProduct)
);
router.put(
  "/updateProduct/:productId",
  auth(endPoint.update),
  fileUpload(fileValidation.image).fields([
    { name: "mainImage", maxCount: 1 },
    { name: "subImages", maxCount: 5 },
  ]),
  // validation(validators.updateProductSchema),
  asyncHandler(ProductController.updateProduct)
);


router.patch(
  "/softDeleteProduct/:productId",
  auth(endPoint.softDelete),
  // validation(validators.updateProductSchema),
  asyncHandler(ProductController.softDeleteProduct)
);
router.patch(
  "/restoreDeletedProduct/:productId",
  auth(endPoint.softDelete),
  // validation(validators.updateProductSchema),
  asyncHandler(ProductController.restoreDeletedProduct)
);
router.delete(
  "/forceDeleteProduct/:productId",
  auth(endPoint.delete),
  // validation(validators.updateProductSchema),
  asyncHandler(ProductController.forceDeleteProduct)
);

router.get(
  "/getProductInfo/:productId",
  // validation(validators.getProductSchema),
  asyncHandler(ProductController.getProductInfo)
);

router.get(
  "/getSoftDeletedProducts",
  // validation(validators.getProductSchema),
  asyncHandler(ProductController.getSoftDeletedProducts)
);
// router.get("/getProducts/:categoryId", asyncHandler(ProductController.getProducts));
router.get("/getAllProducts", asyncHandler(ProductController.getAllProducts));
export default router;
