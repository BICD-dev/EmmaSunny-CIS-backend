import {Request, Response} from "express"
import {Router} from "express";
import { loginController, registerOfficerController } from "./auth.controller";
import { authenticate } from "../utils/middleware/authentication";

const router = Router();

router.post('/login', loginController) //handle login for all roles
router.post('/register', authenticate, registerOfficerController) //register officer

export default router;