import { Router } from "express";
import { authenticate } from "../utils/middleware/authentication";
import { deleteCustomer, getAllCustomers, getCustomer, registerCustomerController, renewCustomerController, getCustomerStatistics } from "./customer.controller";

const router = Router();
// prefix is /customer
router.post("/", authenticate, registerCustomerController) //register customer
router.post("/renew", authenticate, renewCustomerController) //renew customer
router.get("/",authenticate, getAllCustomers) // batch get customers
router.get("/statistics", authenticate, getCustomerStatistics); // get customer statistics
router.get("/:id", authenticate, getCustomer) // get customer by id
router.delete("/:id", authenticate, deleteCustomer); // delete customer by id
// get customer statistics like invalid ids, valid ids, total number od customers, and other infos to be displayed in the front end

export default router