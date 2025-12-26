import { Router } from 'express';
import { addProduct, getProductDetails, deleteProduct, getAllProducts } from './product.controller';
import { authenticate } from '../utils/middleware/authentication';

const router = Router();

// Add product
router.post('/',authenticate, addProduct);

// get all products
router.get('/',authenticate, getAllProducts);

// Get product details
router.get('/:id',authenticate, getProductDetails);
// Delete product
router.delete('/:id', authenticate, deleteProduct); // this marks the prduct as inactive

// edit product .... what am i editting sef?

export default router;