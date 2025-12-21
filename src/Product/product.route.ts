import { Router } from 'express';
import { addProduct, getProductDetails, deleteProduct, getAllProducts } from './product.controller';
import { authenticate } from '../utils/middleware/authentication';

const router = Router();

// Add product
router.post('/products',authenticate, addProduct);

// get all products
router.get('/products', getAllProducts);

// Get product details
router.get('/products/:id', getProductDetails);
// Delete product
router.delete('/products/:id', deleteProduct);

// edit product .... what am i editting sef?

export default router;