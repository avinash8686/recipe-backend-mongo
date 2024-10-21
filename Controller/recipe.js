const User = require("../Model/User");
const Recipes = require("../model/Recipe");
const Cuisines = require("../model/Cuisine");
const mongoose = require("mongoose");
var _ = require("underscore");
const Likes = require("../model/Likes");

// CREATE: Create a recipe
const createARecipePost = async (req, res) => {
  try {
    console.log("creatin recipe....", req.body, req.user);
    const { title, description, cuisine } = req.body;
    const newRecipe = Recipes.create({
      title: title,
      description: description,
      user: req.user._id,
      cuisine: cuisine,
    });
    if (!newRecipe)
      throw Error("Something went wrong while creating the recipe");
    res.status(200).json(newRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// READ: get all recipes
const getAllRecipes = async (req, res) => {
  try {
    const allRecipes = await Recipes.find();
    res.status(200).json(allRecipes);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

// Get All Recipes by search
const getAllRecipesBySearch = async (req, res) => {
  try {
    const searchQuery = req.query.search;
    const allRecipes = await Recipes.find({
      title: { $regex: searchQuery, $options: "i" },
    });
    res.status(200).json(allRecipes);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

// READ: get Recipes By User FavCuisines
const getRecipesByUserFavCuisines = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const cuisineIds = [];
    for (let cuisine of user.cuisines) {
      cuisineIds.push(new mongoose.Types.ObjectId(cuisine));
    }

    const recipeLikes = await Likes.find({
      userId: req.user._id,
    }).distinct("recipeId");

    // Below aggregate function finds all the recipes that match with user Fav CuisineIds
    // Next It will look up for the cuisine table with cuisineIds
    // Unwind is used to unfold any nested data
    // Adding the name of cuisine
    // grouping the data such that all the recipes that falls under a name comes in an array
    // projecting the data for only cuisine name & recipes

    const recipes = await Recipes.aggregate([
      {
        $match: {
          cuisine: {
            $in: cuisineIds,
          },
        },
      },
      {
        $lookup: {
          from: "cuisines",
          localField: "cuisine",
          foreignField: "_id",
          as: "cuisineData",
        },
      },
      {
        $unwind: "$cuisineData",
      },
      {
        $addFields: {
          cuisineName: "$cuisineData.name",
          cuisineId: "$cuisineData._id",
          cuisineCreatedAt: "$cuisineName.createdAt",
        },
      },
      {
        $group: {
          _id: "$cuisineName",
          recipes: {
            $push: {
              isFavorite: {
                $cond: {
                  if: { $in: ["$_id", recipeLikes] },
                  then: true,
                  else: false,
                },
              },
              createdAt: "$createdAt",
              _id: "$_id",
              cuisineId: "$cuisineId",
              title: "$title",
              description: "$description",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          recipes: "$recipes",
        },
      },
      {
        $sort: {
          "recipes.createdAt": -1,
        },
      },
    ]);
    res.status(200).json(recipes);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

// READ: get recipe by Recipe Id
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipes.find({ _id: req.params.id });
    res.status(200).json(recipe);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

// UPDATE: Update a recipe
const updateARecipePost = async (req, res) => {
  try {
    const recipe = await Recipes.findById(req.params.id);
    if (!recipe) throw Error("Something went wrong while updating the post");
    const updatedRecipe = await Recipes.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE: Delete a recipe
const deleteARecipePost = async (req, res) => {
  try {
    const recipe = await Recipes.findById(req.params.id);
    if (!recipe) throw Error("Something went wrong while deleting the post");
    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ message: err });
  }
};

// Get recipe by Cuisine Id
const getRecipePostByCuisineId = async (req, res) => {
  try {
    const blogPosts = await Recipes.find({
      cuisine: req.params.id,
    });
    res.status(200).json(blogPosts);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

// Get recipe by Tag Id
const getRecipePostByTagId = async (req, res) => {
  try {
    const post = await Recipes.find({
      tag: req.params.id,
    });
    if (!post) throw Error("no items");
    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ message: err });
  }
};

module.exports = {
  getAllRecipes,
  getAllRecipesBySearch,
  createARecipePost,
  deleteARecipePost,
  updateARecipePost,
  getRecipePostByCuisineId,
  getRecipePostByTagId,
  getRecipesByUserFavCuisines,
};
