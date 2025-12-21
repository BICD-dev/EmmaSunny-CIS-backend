import { Request, Response, NextFunction } from "express";
import { createProduct, deleteProductService, getProductById, getProductsService } from "./product.service";

// Add a new product
export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let productData = req.body;
    const { name, price, description } = productData;
    if (!name || !price || !description) {
      return res.status(400).json({
        status: false,
        message: "Missing fields",
      });
    }
    // validate officer
    const officer = req.user;
    const officer_id = officer?.id;
    productData = {
      ...productData,
      officer_id,
    };

    const result = await createProduct(productData);

    res.status(result.code).json(result);
  } catch (error) {
    next(error);
  }
};

// Get product details by ID
export const getProductDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const result = await getProductById(id);

    res.status(result.code).json(result);
  } catch (error) {
    next(error);
  }
};
// batch get products
export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getProductsService();

    res.status(result.code).json(result);
  } catch (error) {
    next(error);
  }
};
// Delete a product by ID
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const officer = req.user
    if(!officer){
      return res.status(403).json({
        status:false,
        message:"Officer couldn't be authenticated"
      })
    }
    const officer_id = officer?.id

    // TODO: Implement product deletion logic in service
    const result = await deleteProductService(id,officer_id)

    res.status(result.code).json(result);
  } catch (error) {
    next(error);
  }
};
