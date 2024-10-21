const Joi = require("joi");

// register validation
const registerValidation = (data) => {
  console.log("data", data);
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required().min(6),
    password: Joi.string().min(6).required(),
    isAdmin: Joi.boolean().optional(),
  });
  console.log("schema", schema.validate(data));
  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().min(6),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

module.exports.loginValidation = loginValidation;
module.exports.registerValidation = registerValidation;
