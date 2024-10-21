const mongoose = require("mongoose");
const Cuisines = require("../model/Cuisine");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },
    email: {
      type: String,
      required: true,
      max: 255,
    },
    password: {
      type: String,
      required: true,
      max: 1024,
      min: 6,
    },
    initialLogin: {
      type: Boolean,
      default: true,
      required: false,
    },
    cuisines: {
      type: [String],
    },
    isAdmin: {
      type: Boolean,
      default: false,
      required: false,
    },
    date: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
