import { Router } from "express";

import { getAllOfficerController, getOfficerController } from "./officer.controller";
import { authenticate } from "../utils/middleware/authentication";

const router = Router();

router.get("/", authenticate, getAllOfficerController); // get all officers
router.get("/me", authenticate, getOfficerController); // get officer by id
export default router;