const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },          
  type: { type: String, required: true },          
  image: { type: String },                         
  price: { type: Number, required: true },        
  qty: { type: Number },                           
  description: { type: String },                   
  brand: { type: String },                         
  rating: { type: Number },                        
  reviews: { type: Number },                       
 
});

module.exports = mongoose.model('Product', ProductSchema);
