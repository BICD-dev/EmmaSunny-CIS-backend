import { Request, Response, NextFunction } from "express";
import { changeProductStatus, createProduct, editProductDetail, getProductById, getProductsService } from "./product.service";

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
   throw error
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
    throw error
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
    throw error
  }
};
// change a product status by ID
export const changeProductStatusController = async (
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

    // call the service
    const result = await changeProductStatus(id,officer_id)

    res.status(result.code).json(result);
  } catch (error) {
    throw error
  }
};

export const editProductDetailController = async (req: Request, res: Response) => {
  try {
    const officer = req.user;
    if (!officer) {
      return res.status(403).json({
        status: false,
        message: "Officer couldn't be authenticated",
      });
    }
    const officer_id = officer?.id;
    const {id, formData} = req.body
    // validate product id
    if(!id){
      return res.status(404).json({
        status:false,
        message:"Product id not provided"
      })
    }
    // call the service
    const result = await editProductDetail(formData, id, officer_id);
    return res.status(result.code).json(result)
  } catch (error:any) {
    console.error("Error updating product details");
    throw error
  }
}
