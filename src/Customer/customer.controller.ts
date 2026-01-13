import fs from "fs";
import path from "path";
import { NextFunction, Request, Response } from "express";
import {
  deleteCustomerService,
  getAllCustomersService,
  getCustomerById,
  registerCustomerService,
  renewCustomerService,
  getCustomerStatisticsService,
  editCustomerDetail,
  downloadCustomerCSV,
  getMonthlyCustomerRegistrations,
} from "./customer.service";
import prisma from "../prisma";

export const getCustomerStatistics = async (req: Request, res: Response) => {
  try {
    const result = await getCustomerStatisticsService();
    res.status(result.code).json(result);
  } catch (error: any) {
    res
      .status(500)
      .json({ status: false, message: "Failed to fetch statistics" });
  }
};
export const getMonthlyCustomerRegistrationsController = async (req: Request, res: Response) => {
  try {
    const result = await getMonthlyCustomerRegistrations();
    res.status(200).json(result);

  } catch (error:any) {
    throw error
  }
}


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
      address,
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
    const filePath = req.file
      ? `/uploads/profile-images/${req.file.filename}`
      : null;
    if (!filePath) {
      return { status: true, code: 404, message: "Profile image is required" };
    }
    payload = {
      ...req.body,
      profile_image: filePath,
      officer_id,
    };

    // call the service
    const result = await registerCustomerService(payload);
    return res.status(result.code).json(result);
  } catch (error: any) {
    throw error;
  }
};
export const downloadIDCard = async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    const officer_id = req.user?.id;

    if (!officer_id) {
      return res.status(403).json({
        status: false,
        message: "Officer couldn't be authenticated",
      });
    }

    // Sanitize filename to prevent path traversal attacks
    const sanitizedFilename = path.basename(filename);
    const filePath = path.join(__dirname, "../../id-cards", sanitizedFilename);
   

    // Check if id card exists in path
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        status: false,
        message: "ID card not found",
      });
    }

    // Log the download action
    await prisma.log.create({
      data: {
        officer_id: officer_id,
        action: `Downloaded_ID_Card_${sanitizedFilename}`,
      },
    });

    // Set proper headers before download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${sanitizedFilename}"`
    );

    // Download
    res.download(filePath, sanitizedFilename, (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        // Don't send JSON if headers already sent
        if (!res.headersSent) {
          res.status(500).json({
            status: false,
            message: "Error downloading ID card",
          });
        }
      }
    });
  } catch (error) {
    console.error("Error in downloadIDCard:", error);
    if (!res.headersSent) {
      return res.status(500).json({
        status: false,
        message: "Internal server error",
      });
    }
  }
};

export const downloadCustomerCSVController = async (req: Request, res: Response) => {
  try {
    const officer_id = req.user?.id;
    if (!officer_id) {
      return res.status(403).json({
        status: false,
        message: "Officer couldn't be authenticated",
      });
    }

    const result = await downloadCustomerCSV();
    if (!result || !result.status) {
      return res.status(result?.code ?? 500).json(result);
    }

    // Log the download action
    await prisma.log.create({
      data: {
        officer_id: officer_id,
        action: `Downloaded_customers_csv`,
      },
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${result.filename || "customers.csv"}"`
    );

    return res.send(result.csv);
  } catch (error: any) {
    console.error("Error in downloadCustomerCSVController:", error);
    if (!res.headersSent) {
      return res.status(500).json({ status: false, message: "Internal server error" });
    }
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
    return res.status(result.code).json(result);
  } catch (error: any) {
    throw error;
  }
};

export const renewCustomerController = async (req: Request, res: Response) => {
  try {
    const { customer_id, product_id } = req.body;
    // validate missing fields
    if (!customer_id || !product_id) {
      return res.status(400).json({
        status: false,
        message: "Missing fields",
      });
    }
    const officer_id = req.user?.id;
    if (!officer_id) {
      return res.status(403).json({
        status: false,
        message: "Officer couldn't be authenticated",
      });
    }
    // call the service
    const result = await renewCustomerService(
      customer_id,
      product_id,
      officer_id
    );
    return res.status(result.code).json(result);
  } catch (error: any) {
    throw error;
  }
};

export const deleteCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const officer = req.user;
    if (!officer) {
      return res.status(403).json({
        status: false,
        message: "Officer couldn't be authenticated",
      });
    }
    // only admins can delete a customer
    if(officer.role !== "admin"){
      return res.status(403).json({
        status: false,
        message: "Only admins can delete a customer",
      });
    }
    const officer_id = officer?.id;
    // call service
    const result = await deleteCustomerService(id, officer_id);

    return res.status(result.code).json(result);
  } catch (error) {
    throw error;
  }
};

export const editCustomerDetailController = async (req: Request, res: Response) => {
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
    // validate customer id
    if(!id){
      return res.status(404).json({
        status:false,
        message:"Customer id not provided"
      })
    }
    // call the service
    const result = await editCustomerDetail(formData, id, officer_id);
    return res.status(result.code).json(result)
  } catch (error:any) {
    console.error("Error updating customer details");
    throw error
  }
}