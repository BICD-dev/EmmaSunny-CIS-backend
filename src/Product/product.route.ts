import { Router } from 'express';
import { addProduct, getProductDetails, getAllProducts, changeProductStatusController, editProductDetailController } from './product.controller';
import { authenticate } from '../utils/middleware/authentication';

const router = Router();

// Add product
router.post('/',authenticate, addProduct);

// get all products
router.get('/',authenticate, getAllProducts);

// Get product details
router.get('/:id',authenticate, getProductDetails);
// change product status
router.delete('/:id', authenticate, changeProductStatusController); // this toggles the product status between active and inactive

// edit product .... what am i editting sef?
router.post("/update", authenticate, editProductDetailController)
export default router;