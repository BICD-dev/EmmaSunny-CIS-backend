import { Request, Response } from "express"
import { getAllOfficerService } from "./officer.service";
// get all officers
export const getAllOfficerController = async (req: Request, res: Response) => {
    try {
        const result = await getAllOfficerService();
        return res.status(result.code).json(result);
    } catch (error:any) {
        console.error("Error in get all officers controller: ", error);
        res.status(500).json({
            status: false,
            code: 500,
            message: "Internal server error",
            data: null,
        });
        throw error;
    }
}