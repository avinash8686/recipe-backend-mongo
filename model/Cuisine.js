const mongoose = require("mongoose");

const cuisineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: [
        "Italian",
        "Thai",
        "Chinese",
        "Greek-American",
        "Japanese",
        "Mexican",
        "Vietnamese",
        "American",
        "Eurasian cuisine of Singapore and Malaysia",
        "French",
        "African",
        "Anglo-Indian",
        "Asian",
        "Belizean",
        "Cuban",
        "Fusion",
        "Indian",
        "Panamanian",
        "Salvadoran",
        "Turkish",
      ],
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cuisines", cuisineSchema);
