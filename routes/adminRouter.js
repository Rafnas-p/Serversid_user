const express = require("express");
const router = express.Router();
const authMiddilware = require("../middilewares/authMiddilware");
const adminController = require("../Controller/adminController");

router.post("/adminlogin", adminController.admiLogin);
router.get("/viewAllUsers",authMiddilware, adminController.viewAllUsers);
router.get("/getUser/:userId",authMiddilware, adminController.getUserById);
router.get("/getallProduts",authMiddilware, adminController.getAllProducts);
router.get("/getPrByCategory/:type",authMiddilware, adminController.getPrByCategory);
router.get("/getProductById/:_id",authMiddilware, adminController.getProductById);
router.post("/creatProduct",authMiddilware, adminController.creatProduct);
router.delete("/deleatProduct/:id",authMiddilware, adminController.deleatProduct);
router.put("/updateproduct/:id",authMiddilware,adminController.updateproduct);
router.get("/totalProductPurchased",authMiddilware,adminController.totalProductPurchased);
router.get("/totalRevenue",authMiddilware,adminController.totalRevenue)
router.get("/OrderDetails",authMiddilware,adminController.OrderDetails)
router.get("/orderDeatailsByUser/:userId",authMiddilware,adminController.orderDeatailsByUser)
module.exports = router;
