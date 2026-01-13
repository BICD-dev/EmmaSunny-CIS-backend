import { Request, Response } from "express";
import { errorHandler } from "../utils/middleware/error-handler";
import { loginService, registerOfficerService } from "./auth.service";

export const loginController = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    // validate for missing fields
    const { username, password } = data;
    if (!username || !password) {
      return res.status(400).json({
        status: false,
        message: "Missing fields",
      });
    }
    // call the service
    const result = await loginService(data);
    return res.status(result.code).json(result);
  } catch (error: any) {
    console.error("Error logging in: ", error);
    res.status(500).json({
            status: false,
            code: 500,
            message: "Internal server error",
            data: null,
        });
    throw Error("Error logging in");
  }
};

export const registerOfficerController = async (
  req: Request,
  res: Response
) => {
  try {
    // validate fields
    const data = req.body;
    const { first_name, last_name, email, phone, role, password, username } =
      data;

    if (
      !first_name ||
      !last_name ||
      !email ||
      !phone ||
      !role ||
      !password ||
      !username
    ) {
      return {
        status: false,
        code: 404,
        message: "Missing fields",
      };
    }
    // validate token
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        status: false,
        message: "Invalid or expired token",
      });
    }
    // only an admin can create officers
    if (user.role !== "admin") {
      return res.status(403).json({
        status: false,
        message: "Only admins can create an account for officers",
      });
    }
    const result = await registerOfficerService(data, user.id);
    return res.status(result.code).json(result);
  } catch (error) {
    console.error("Error logging in: ", error);
    res.status(500).json({
            status: false,
            code: 500,
            message: "Internal server error",
            data: null,
        });
    throw Error("Error logging in");
  }
};


export const resetPasswordController = async (req:Request, res:Response)=>{
  try {
    
  } catch (error) {
    
  }
}