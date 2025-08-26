import express from 'express';
import { createProduct, getProducts,updateProduct,deleteProduct,getProduct} from '../controllers/productController.js';

const router = express.Router();


router.get('/',  getProducts); 
router.get('/:id',  getProduct);
router.post('/',createProduct );
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

//create a product









export default router;