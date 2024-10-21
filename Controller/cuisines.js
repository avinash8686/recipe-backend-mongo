const Recipes = require("../model/Recipe");
const Cuisines = require("../model/Cuisine");
var _ = require("underscore");

const addACuisine = async (req, res) => {
  try {
    const cuisineFound = await Cuisines.find({
      name: req.body.name,
    });

    if (!_.isEmpty(cuisineFound)) {
      throw Error("Cuisine type exists already!!!");
    }

    const cuisine = await Cuisines.create({
      name: req.body.name,
    });
    res.status(200).json(cuisine);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

const getAllCuisines = async (req, res) => {
  try {
    const allCuisines = await Cuisines.find();
    res.status(200).json(allCuisines);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

module.exports = {
  addACuisine,
  getAllCuisines,
};
