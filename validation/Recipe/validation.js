const Joi = require("joi");

// recipe validation
const recipeValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    image: Joi.string().min(3).required(),
    tag: Joi.string().optional(),
    cuisine: Joi.string().min(6).required(),
    user: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

module.exports.recipeValidation = recipeValidation;
