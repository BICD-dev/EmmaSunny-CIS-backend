import { Router } from "express";

import { getAllOfficerController } from "./officer.controller";
import { authenticate } from "../utils/middleware/authentication";

const router = Router();

router.get("/", authenticate, getAllOfficerController); // get all officers
router.get
export default router;