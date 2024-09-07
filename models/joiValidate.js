const joi = require('joi');

// User registration validation schema
const joiRegisterScema = joi.object({
  username: joi.string().min(3).required(),
  email: joi.string().email().required(),
  password: joi.string().min(4).required(),
});

module.exports = {
  joiRegisterScema,
};
