const mongoose = require("mongoose");
const Tags = require("../model/Tag");
const Cuisines = require("../model/Cuisine");
const User = require("../model/User");

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },
    image: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: true,
      min: 200,
    },
    tag: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Tags,
      required: false,
    },
    cuisineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Cuisines,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Recipe", recipeSchema);
