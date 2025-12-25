import prisma from "../prisma";
import { AppError } from "../utils/middleware/error-handler";

interface ProductData {
  name: string;
  price: string;
  description: string;
  officer_id: string;
  // valid_period:number, default is 1
}
// create product function
export const createProduct = async (payload: ProductData): Promise<any> => {
  // check if he officer exists
  const officer = await prisma.officer.findUnique({
    where: { id: payload.officer_id },
  });
  if (!officer) {
    return {
      status: false,
      code: 400,
      message: "Officer id not found",
    };
  }
  return await prisma.$transaction(async (tx) => {
    // create product
    try {
      const product = await tx.product.create({
        data: {
          product_name: payload.name,
          price: payload.price,
          description: payload.description,
        },
      });
      // log creation of product
      await tx.log.create({
        data: {
          officer_id: officer.id,
          action: `created_product_${product.product_name}`,
        },
      });
      // success message
      return {
        status: true,
        code: 200,
        message: "Product created successfully",
        product: {
          id: product.id,
          name: product.product_name,
          description: product.description,
          price: product.price,
          valid_period: product.valid_period,
          created_at: product.created_at,
        },
      };
    } catch (error: any) {
      // this flags if the email already exists
      if (error.code === "P2002") {
        throw new AppError("Product already exists", 409);
      }
      throw error; //for any unexpected error
    }
  });
};

export const getProductsService = async () => {
  try {
    const product = await prisma.product.findMany();
    return {
      status: true,
      code: 200,
      message: "Products fetched successfully",
      product,
    };
  } catch (error: any) {
    console.error("An error occured while fetching products: ", error);
    throw error;
  }
};

export const getProductById = async (id: string) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: id },
    });
    if(!product){
      throw new AppError("Product not found", 404);
    }
    return {
      status: true,
      code: 200,
      message: "Product fetched successfully",
      product,
    };
  } catch (error: any) {
    console.error("An error occured while fetching product: ", error);
    throw error;
  }
};

export const deleteProductService = async (id: string, officer_id: string) => {
  try {
    return await prisma.$transaction(async (tx) => {
      // check if product exists
      const product = tx.product.findUnique({
        where: { id: id },
      });
      if (!product) {
        throw new AppError("Product not found", 404)
      }
      // delete product
      const deleteProduct = await tx.product.update({
        where:{id:id},
        data:{status:"inactive"}
      });
      // log action
      await tx.log.create({
        data: {
          officer_id: officer_id,
          action: `Deleted_product_${deleteProduct.product_name}`,
        },
      });

      return {
        status: true,
        code: 200,
        message: "Product deleted successfully",
      };
    });
  } catch (error: any) {
    console.error("An error occured while deleting product: ", error);
    throw error;
  }
};
