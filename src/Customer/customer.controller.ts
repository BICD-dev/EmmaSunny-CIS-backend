import { NextFunction, Request, Response } from "express";
import {
    deleteCustomerService,
  getAllCustomersService,
  getCustomerById,
  registerCustomerService,
  renewCustomerService,
} from "./customer.service";

export const registerCustomerController = async (
  req: Request,
  res: Response
) => {
  try {
    let payload = req.body;
    const {
      first_name,
      last_name,
      email,
      phone,
      gender,
      DateOfBirth,
      product_id,
      address
    } = payload;
    // validate for missing fields
    if (
      !first_name ||
      !last_name ||
      !email ||
      !phone ||
      !gender ||
      !DateOfBirth ||
      !product_id ||
      !address
    ) {
      return res.status(400).json({
        status: false,
        message: "Missing fields",
      });
    }
    // validate authentication
    const officer = req.user;
    const officer_id = officer?.id;
    // add officer id to payload
    payload = { ...payload, officer_id };

    // call the service
    const result = await registerCustomerService(payload);
    return res.status(result.code).json(result);
  } catch (error: any) {
    throw error
  }
};

export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    // call the service
    const result = await getAllCustomersService();
    res.status(result.code).json(result);
  } catch (error: any) {
    throw error;
  }
};

export const getCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // validate missing fields
    if (!id) {
      return res.status(400).json({
        status: false,
        message: "Missing field",
      });
    }
    // call the service
    const result = await getCustomerById(id);
    res.status(result.code).json(result);
  } catch (error: any) {
    throw error;
  }
};

export const renewCustomerController = async (req: Request, res: Response) => {
  try {
    const { customer_id, officer_id, product_id } = req.body;
    // validate missing fields
    if (!customer_id || !officer_id || !product_id) {
      return res.status(400).json({
        status: false,
        message: "Missing fields",
      });
    }
    // call the service
    const result = await renewCustomerService(customer_id, product_id, officer_id);
    res.status(result.code).json(result)
  } catch (error: any) {
    throw error;
  }
};

export const deleteCustomer = async (req: Request, res: Response,next:NextFunction) => {
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
    const result = await deleteCustomerService(id,officer_id)

    res.status(result.code).json(result);
  } catch (error) {
    next(error);
  }
}