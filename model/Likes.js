const mongoose = require("mongoose");
const Tags = require("../model/Tag");
const Cuisines = require("../model/Cuisine");
const Recipe = require("../model/Recipe");
const User = require("../model/User");

const likeSchema = new mongoose.Schema(
  {
    recipeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Recipe,
      required: true,
    },
    cuisineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Cuisines,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Likes", likeSchema);
