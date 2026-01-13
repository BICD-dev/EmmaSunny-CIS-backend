import { Router } from "express";
import { authenticate } from "../utils/middleware/authentication";
import { deleteCustomer, getAllCustomers, getCustomer, registerCustomerController, renewCustomerController, getCustomerStatistics, downloadIDCard, editCustomerDetailController, downloadCustomerCSVController, getMonthlyCustomerRegistrationsController } from "./customer.controller";
import { moderateLimiter, relaxedLimiter } from "../utils/middleware/rateLimit";
import { uploadProfileImage } from "../utils/middleware/uploadProfileImage";
const router = Router();
// prefix is /customer
router.post("/", authenticate,relaxedLimiter, uploadProfileImage.single('profile_image'),registerCustomerController) //register customer
router.post("/renew", authenticate,relaxedLimiter, renewCustomerController) //renew customer
router.get("/",authenticate, getAllCustomers) // batch get customers
router.get("/statistics", authenticate, getCustomerStatistics); // get customer statistics
router.get("/:id", authenticate, getCustomer) // get customer by id
router.delete("/:id", authenticate, deleteCustomer); // delete customer by id
router.get('/id-card/:filename', authenticate,moderateLimiter, downloadIDCard); // download customer id card
router.get('/download/csv', authenticate, moderateLimiter, downloadCustomerCSVController); // download customers CSV
router.put("/update",authenticate,uploadProfileImage.single('profile_image'),editCustomerDetailController); // edit customer details 
router.get("/analytics/customer-registrations",authenticate, getMonthlyCustomerRegistrationsController)
export default router