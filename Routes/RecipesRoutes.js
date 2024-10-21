const express = require("express");
const verify = require("../middleware/privateRoute");
const router = express.Router();

const {
  getAllRecipes,
  getAllRecipesBySearch,
  createARecipePost,
  deleteARecipePost,
  updateARecipePost,
  getRecipePostByCuisineId,
  getRecipePostByTagId,
  getRecipesByUserFavCuisines,
} = require("../Controller/recipe");

// Admin
router.post("/", verify, createARecipePost);

router.get("/search", verify, getAllRecipesBySearch);

router.get("/", verify, getAllRecipes);

router.get("/by-user-fav-cuisne", verify, getRecipesByUserFavCuisines);

router.put("/:id", verify, updateARecipePost);

router.delete("/:id", verify, deleteARecipePost);

router.get("/cuisine/:id", verify, getRecipePostByCuisineId);

router.get("/tag/:id", verify, getRecipePostByTagId);

module.exports = router;
