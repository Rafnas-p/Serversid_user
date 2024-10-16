// models/Order.js
const mongoose = require('mongoose');

// Order Schema
const orderSchema = new mongoose.Schema({
  userDetails: {
    name: String,
    email: String,
  },
  totalPrice: Number,
  status: { type: String, default: 'Order Confirmed' },
  purchaseDate: Date,
});

// Create the Order model
const Order = mongoose.model('OrderStatus', orderSchema);

module.exports = Order;