const express = require('express');
const router = express.Router();
const userController= require('../Controller/userController')
const authMiddilware =require('../middilewares/authMiddilware')
// User registration route
router.post('/register', userController.register);
router.post('/login',userController.login);
router.get('/products',userController.gettAllproducts)
router.get('/products/:type',userController.productsBytype)
router.get('/product/:productId',userController.getproductById)
router.post('/cart/add',authMiddilware,userController.addToCart);
router.get('/getCartItem',authMiddilware,userController.getCartItem)
router.post('/wishlist/add',authMiddilware,userController.wishliste)
router.get('/gettwishlist/',authMiddilware,userController.getWishlist)
router.delete('/removeCartitem/:productId',authMiddilware,userController.removeCartitem)
router.post('/order',authMiddilware,userController.createOrder)
router.post('/order/verify',authMiddilware, userController.verifypayment)
router.get('/order/deatils',authMiddilware,userController.orderDeatails)

module.exports = router;
