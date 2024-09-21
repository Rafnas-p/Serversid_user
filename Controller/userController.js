const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { joiRegisterScema } = require("../models/joiValidate");
const Product = require("../models/prodectModel");
const Cart = require("../models/cartModal");
const Wishlist = require("../models/whishlistModal");
const Razorpay = require("razorpay");
const Order = require("../models/oderSchema");
const mongoose = require('mongoose');
require("dotenv").config();

// User registration
exports.register = async (req, res) => {
  try {
    const { error } = joiRegisterScema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ status: "failed", message: error.details[0].message });
    }

    // console.log('register', req.body);
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(200).json({ message: "User registered successfully", newUser });
  } catch (error) {
    return res.status(400).json({ status: "failed", message: error.message });
  }
};

//login section
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid email" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid password" });
//     }

  
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
//     res.status(200).json({ message: "Login successful", token });
//   } catch (error) {
//     return res.status(500).json({ status: "failed", message: error.message });
//   }
// };



exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};





//getAll product

exports.gettAllproducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// products by category(type).

exports.productsBytype = async (req, res) => {
  try {
    const { type } = req.params;
    const products = await Product.find({ type });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ massage: "Faild to featch prodects", error });
  }
};
//get prodect by id

exports.getproductById = async (req, res) => {
  try {
    const { productId,  } = req.params;
    console.log("Product ID:", productId);

    const product = await Product.findById(productId);
    console.log("Product:", product);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error); 
    res
      .status(500)
      .json({ message: "Failed to get product", error: error.message });
  }
};

//AdToCart
exports.addToCart = async (req, res) => {
  try {
    const userId=req.userId;
    console.log(userId);
    
    const { productId } = req.body;

    const cart = await Cart.findOne({ userId: userId });

    if (cart) {
      const existingProduct = cart.products.find((p) =>
        p.productId.equals(productId)
      );

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.products.push({ productId, quantity: 1 });
      }

      await cart.save();
    } else {
      const newCart = Cart({
        userId,
        products: [{ productId, quantity: 1 }],
      });
      await newCart.save();
    }

    res.status(201).json({ message: "Product added to cart" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// // get Cart item
// exports.getCartItem = async (req, res) => {
//   try {
    
//     // const { userId } = req.params;
//     const { userId } = req.body;
//     // Read userId from query parameters
//     console.log('id26',userId);
    

//     const cart = await Cart.findOne({ userId }).populate("products.productId");
//     console.log(cart);

//     if (!cart) {
//       return res.status(404).json({ message: "cart not found" });
//     }
//     res.status(200).json(cart.products);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
exports.getCartItem = async (req, res) => {
  try {
    const { userId } = req.body; // Read userId from request body
    console.log('userId received:', userId);

    const cart = await Cart.findOne({ userId }).populate('products.productId');
    console.log('Cart found:', cart);

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.status(200).json(cart.products);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ message: error.message });
  }
};


//deleat cart quntyty

exports.removeCartitem = async (req, res) => {
  try {
    const userId=req.userId
    const { productId } = req.params;
    

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "cart nout found" });
    }

    const productIndex = cart.products.findIndex((product) =>
      product.productId.equals(productId)
    );
    if (productIndex === -1) {
      return res.status(404).json({ message: "product not found" });
    }
    cart.products.splice(productIndex,1);
    await cart.save();
    res.status(200).json({ message: "cart item deleated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCartItemQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    
    const userId = req.userId; 

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    // Find the product in the cart
    const productIndex = cart.products.findIndex(item => item.productId.toString() === productId.toString());

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    // Update the quantity
    cart.products[productIndex].quantity += quantity;

    // Save the updated cart
    if(cart.products[productIndex].quantity>0){

      await cart.save();
    }else{
      cart.products[productIndex].quantity =1
      await cart.save()
    }

    res.status(200).json({ message: 'Cart item updated successfully', cart });
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add to wishlist
exports.wishliste = async (req, res) => {
  try {
    const userId = req.userId;
    
    
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required." });
    }
    
    
    const productObjectId = new mongoose.Types.ObjectId(productId);
    let wishlist = await Wishlist.findOne({ userId: userId });
  
    
    if (!wishlist) {
      wishlist = new Wishlist({ userId: userId, products: [productObjectId] });
      await wishlist.validate(); 
      await wishlist.save();
      console.log("new wishlist", wishlist);
      return res.status(200).json({ message: "Product added to wishlist", wishlist });
    } else {
      // Filter out null values and check for the product's index
      const productIndex = wishlist.products.filter(product => product !== null).findIndex((product) => product.equals(productObjectId));

      if (productIndex !== -1) {
        wishlist.products.splice(productIndex, 1); // Remove the product
        await wishlist.save();
        return res.status(200).json({ message: "Product removed from wishlist", wishlist });
      } else {
        wishlist.products.push(productObjectId); // Add the product
      }
    }

    await wishlist.save(); // Save the updated wishlist
    console.log('updated wishlist', wishlist);
    
    res.status(200).json({ message: "Product added to wishlist", wishlist });
  } catch (error) {
    console.error('Error updating wishlist:', error);
    res.status(500).json({ message: "Error updating wishlist", error });
  }
}


//get wishlist items

exports.getWishlist = async (req, res) => {
  try {
    const userId=req.userId;

    const wishlist = await Wishlist.findOne({ userId: userId }).populate("products");
    console.log("wish", wishlist);

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }
    res.status(200).json(wishlist.products);
  } catch (error) {
    res.status(500).json({ massege: "Error fetching wishlist", error });
  }
};

exports.removewishlist = async (req, res) => {
  try {
    const userId = req.userId;
    
    
    const { productId } = req.params;

    // Find the wishlist by userId
    const wishlist = await Wishlist.findOne({ userId });
    
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    // Find the index of the product in the wishlist products array
    const productIndex = wishlist.products.findIndex((product) => 
      product.equals(productId)  // Compare productId, not wishlist id
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in wishlist" });
    }

    // Remove the product from the wishlist
    wishlist.products.splice(productIndex, 1);

    // Save the updated wishlist
    await wishlist.save();

    return res.status(200).json({ message: "Wishlist item deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



//creat order
exports.createOrder = async (req, res) => {
  const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  try {
    const userId=req.userId
    const {  name, place, phone, address } = req.body;

    const cart = await Cart.findOne({ userId })
      .populate("products.productId")
      .exec();

    if (!cart || cart.products.length === 0) {
      console.error("Cart is empty or not found for userId:", userId);
      return res.status(400).json({ message: "Cart is empty or not found" });
    }

    const totalPrice = Math.round(
      cart.products.reduce(
        (acc, item) => acc + item.productId.price * item.quantity,
        0
      )
    );
    console.log("Total Price:", totalPrice);

    const options = {
      amount: totalPrice * 100,
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
      payment_capture: 1,
    };
    console.log("Razorpay Order Options:", options);

    const razorpayOrder = await razorpayInstance.orders.create(options);
    if (!razorpayOrder) {
      return res.status(500).json({ message: "Error creating Razorpay order" });
    }

    const newOrder = new Order({
      userId,
      products: cart.products,
      totalPrice,
      totalItem: cart.products.length,
      totalQuantity: cart.products.reduce(
        (acc, item) => acc + item.quantity,
        0
      ),
      purchaseDate: Date.now(),
      orderId: razorpayOrder.id,
      paymentStatus: "pending",
      userDetails: { name, place, phone, address },
    });

    await newOrder.save();
    await Cart.findByIdAndDelete(cart._id);

    res.status(200).json({
      message: "Order created successfully",
      order: newOrder,  
    });
  } catch (error) {
    console.error("Error in createOrder:", error);
    res.status(500).json({ message: error.message });
  }
};

//veryfay payment

exports.verifypayment = async (req, res) => {
  try {
    const { razorpayOrderId } = req.body;

    const order = await Order.findOneAndUpdate(
      { orderId: razorpayOrderId },
      { paymentStatus: "Completed" },
      { new: true }
    );
    res.status(200).json({ message: "Payment verified successfully", order });
  } catch (error) {
    console.error("Error in verifyPayment:", error);
    res.status(500).json({ message: error.message });
  }
};

//Order details that the user purchased

exports.orderDeatails=async (req,res)=>{
try{
  const userId=req.userId

  const orderdDeatails=await Order.find({userId, paymentStatus:"Completed"}).populate('products.productId');
  console.log("oderdetails",orderdDeatails);
  
  if(!orderdDeatails){
    return res.status(404).json({message:'No compleated order'})

  }
res.status(200).json({message:'order details retrieved successfuly', orderdDeatails})
}catch(error){
res.status(500).json({ message: error.message })
}
}