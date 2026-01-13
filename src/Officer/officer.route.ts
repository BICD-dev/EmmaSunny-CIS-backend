import { Router } from "express";

import { deleteOfficerController,getActivityLogsController , getAllOfficerController, getOfficerController } from "./officer.controller";
import { authenticate } from "../utils/middleware/authentication";

const router = Router();

router.get("/", authenticate, getAllOfficerController); // get all officers
router.get("/me", authenticate, getOfficerController); // get officer by id
router.delete("/delete/:id", authenticate, deleteOfficerController) // change officer status to inactive
router.get('/logs', authenticate, getActivityLogsController); //logs of all activity taken y an officer
export default router;