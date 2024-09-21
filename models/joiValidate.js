const joi = require('joi');

// User registration validation schema
const joiRegisterScema = joi.object({
  username: joi.string().min(3).required(),
  email: joi.string().email().required(),
  password: joi.string().min(4).required(),
});

// Joi login schema
const joiLoginScema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(4).required(),
});

// Product validation schema
const joiCreateProductSchema = joi.object({
  name: joi.string().required(),
  description: joi.string().required(),
  price: joi.number().required(),
  image: joi.string().required(), 
  type: joi.string().required(),
  stars: joi.number().required().min(0).max(5)
});

module.exports = {
  joiRegisterScema,
  joiLoginScema,
  joiCreateProductSchema
};
