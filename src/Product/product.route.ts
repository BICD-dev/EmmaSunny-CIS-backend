import { Router } from 'express';
import { addProduct, getProductDetails, deleteProduct } from './product.controller';

const router = Router();

// Add product
router.post('/products', addProduct);

// Get product details
router.get('/products/:id', getProductDetails);

// Delete product
router.delete('/products/:id', deleteProduct);

export default router;