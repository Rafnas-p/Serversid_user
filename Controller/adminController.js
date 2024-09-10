require("dotenv").config();
const {
  joiLoginScema,
  joiCreateProductSchema,
} = require("../models/joiValidate");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Product = require("../models/prodectModel");
const Order = require("../models/oderSchema");

exports.admiLogin = async (req, res) => {
  const { error } = joiLoginScema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { password, email } = req.body;

  const admin_key = process.env.Admin_KEY;
  const admin_password = process.env.Admin_Pass_Word;
  if (email === admin_key && password === admin_password) {
    const token = jwt.sign({ isAdmin: true }, process.env.JWT_SECRET, {
      expiresIn: "1D",
    });
    return res.status(200).json({
      token,
      user: { isAdmin: true, email: admin_key },
    });
  }
};

//view all users

exports.viewAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: error, error: "users not found" });
  }
};

//View a specific user

exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    console.log("user", user);
    if (!user) {
      res.status(400).json({ message: "user Not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};
//get all products

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "product not found", error: error });
  }
};
//View all the products by category

exports.getPrByCt = async (req, res) => {
  try {
    const { type } = req.params;
    console.log(type);

    const products = await Product.find({ type });
    console.log(products);

    if (products) {
      res.status(200).json(products);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//View a specific product.
exports.getProductById = async (req, res) => {
  try {
    const { _id } = req.params;
    const product = await Product.findById(_id);
    console.log(_id);

    if (!Product) {
      res.status(404).json({ message: "product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};
//Create a product
exports.creatProduct = async (req, res) => {
  try {
    const { error } = joiCreateProductSchema.validate(req.body);
    if (error) res.status(404).json({ message: error.details[0].message });

    const { name, description, price, image, type, stars } = req.body;

    const newProduct = new Product({
      name,
      description,
      price,
      image,
      type,
      stars,
    });
    await newProduct.save();

    res
      .status(201)
      .json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: "Failed", error: error.message });
  }
};

//Delete a product.

exports.deleatProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      res.status(404).json({ message: "product not found" });
    } else {
      res.status(200).json({ message: "Product deleat succesfully" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed", error: error.message });
  }
};
//Update a product.

exports.updateproduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id", id);

    const { name, description, price, image, type, stars } = req.body;
    const updateProduct = await Product.findOneAndUpdate(
      { _id: id },
      { name, description, price, image, type, stars },
      { new: true }
    );

    res.status(200).json({
      message: "Product updated successfully",
      product: updateProduct,
    });
    console.log("up", updateProduct);
  } catch (error) {
    res.status(500).json({ message: "Failed", error: error.message });
  }
};
//Total products purchased.

exports.totalProductPurchased = async (req, res) => {
  try {
    const totalProductPurchased = await Order.aggregate([
      { $group: { _id: null, totalQuantity: { $sum: "$totalQuantity" } } },
    ]);
    res
      .status(200)
      .json({ totalQuantity: totalProductPurchased[0]?.totalQuantity || 0 });
  } catch (error) {
    res.status(500).json({ message: error.message, error: error });
  }
};


//Total revenue generated
exports.totalRevenue = async (req, res) => {

  try{
  const totalRevenue = await Order.aggregate([
    { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
  ]);
  console.log("totalrevenue", totalRevenue);

  // Aggregate revenue by month
  const monthlyRevenue = await Order.aggregate([
    {
      $group: {
        _id: { $month: "$purchaseDate" },
        revenue: { $sum: "$totalPrice" }
      }
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        month: {
          $dateToString: {
            format: "%B",
            date: {
              $dateFromParts: {
                year: { $year: new Date() },
                month: "$_id"
              }
            }
          }
        },
        revenue: 1,
        _id: 0
      }
    }
  ]);

  // Send response
  res.status(200).json({
    totalRevenue: totalRevenue[0]?.totalRevenue || 0,
    monthly: monthlyRevenue
  });
} catch (error) {
  console.error("Error fetching revenue data:", error);
  res.status(500).json({ message: error.message, error: error });
}
        
}
//Order Details

exports.OrderDetails=async(req,res)=>{

  try{
  const orderDeatails=await Order.find()
  if (!orderDeatails){
    res.status(404).json({message:"order deatails not found"})
  }
  res.status(200).json(orderDeatails)
  }catch{
res.status(500).json({message:" message: error.message, error: error"})
  }
}

//oder details by user
exports.orderDeatailsByUser=async (req,res)=>{
  try {
    const {userId}=req.params;
    const orders=await Order.find({userId, paymentStatus: "Completed"}) .populate({
      path: 'products.productId',
      select: 'name description price image category stars' 
    });
    console.log('orde',orders);
    if (! orders|| orders.length === 0) {
      return res.status(404).json({ message: "Order details not found" });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message, error: error });
  }
    
  
}