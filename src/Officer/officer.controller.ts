import { Request, Response } from "express"
import { deleteOfficer, getActivityLogs, getAllOfficerService, getOfficerById } from "./officer.service";
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

export const getOfficerController = async (req: Request, res: Response) => {
    try {
        const officer = req.user;
        const id = officer?.id;
        const result = await getOfficerById(id!);
        return res.status(result.code).json(result);
    } catch (error:any) {
        console.error("Error in get officer controller: ", error);
        res.status(500).json({
            status: false,
            code: 500,
            message: "Internal server error",
            data: null,
        });
        throw error;
    }
}

export const deleteOfficerController = async  (req: Request, res: Response) =>{ 
    try {
        const officer = req.user;
        const officer_id = officer?.id
        // validate officer id
        if(!officer_id){
            return res.status(400).json({
                status:false,
                code:404,
                message:"Officer Id not found"
            })
        }
        // only amdins can chage an officers status
        if(officer.role !== "admin"){
            return res.status(403).json({
                status:false,
                message:"Only admins can change officer status"
            })
        }
        const {id}  = req.params;
        const result = await deleteOfficer(id, officer_id)
        return res.status(result.code).json(result)
    } catch (error:any) {
        console.error("Error deleting officer: ", error);
        throw error
    }
}

export const getActivityLogsController = async (req: Request, res: Response) =>{ 
    try {
        const officer = req.user;
        const officer_role = officer?.role;
        // check that the offcer is an admin
        // only admins can access this route
        if(officer_role !== "admin"){
            return res.status(403).json({
                status:false,
                message:"Only admins are authorized to access this information"
            })
        }
        // call the service
        const result = await getActivityLogs();
        return res.status(result.code).json(result)
    } catch (error:any) {
        console.error("Error getting activity logs: ", error);
        throw error
    }
}