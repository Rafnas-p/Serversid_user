const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  totalItem: { type: Number, required: true },
  totalQuantity: { type: Number, required: true },
  purchaseDate: { type: Date, default: Date.now },
  orderId: { type: String, required: true },
  paymentStatus: { type: String, default: 'pending' },
  userDetails: {
    name: { type: String, required: true },
    place: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
  },
});

module.exports = mongoose.model('Order', orderSchema);
