const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  getLowStockProducts
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getProducts)
  .post(createProduct);

router.get('/lowstock', getLowStockProducts);

router.route('/:id')
  .get(getProduct)
  .put(updateProduct)
  .delete(deleteProduct);

router.patch('/:id/stock', updateStock);

module.exports = router;
