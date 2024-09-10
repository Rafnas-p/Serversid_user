const express = require("express");
const router = express.Router();c
const authMiddilware = require("../middilewares/authMiddilware");
const adminController = require("../Controller/adminController");

router.post("/adminlogin", adminController.admiLogin);
router.get("/viewAllUsers", adminController.viewAllUsers);
router.get("/getUser/:userId", adminController.getUserById);
router.get("/getallProduts", adminController.getAllProducts);
router.get("/getPrByCt/:type", adminController.getPrByCt);
router.get("/getProductById/:_id", adminController.getProductById);
router.post("/creatProduct", adminController.creatProduct);
router.delete("/deleatProduct/:id", adminController.deleatProduct);
router.post("/updateproduct/:id",adminController.updateproduct);
router.get("/totalProductPurchased",adminController.totalProductPurchased);
router.get("/totalRevenue",adminController.totalRevenue)
router.get("/OrderDetails",adminController.OrderDetails)
router.get("/orderDeatailsByUser/:userId",adminController.orderDeatailsByUser)
module.exports = router;
