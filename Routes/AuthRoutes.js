const express = require("express");
const verify = require("../middleware/privateRoute");

const router = express.Router();
const {
  register,
  login,
  refreshToken,
  addCuisinesToUser,
  getUserDetails,
  getUserFavoriteCuisines,
  addUserFavRecipe,
  getUserFavRecipes,
} = require("../Controller/auth");

// User related routes
router.get("/", verify, getUserDetails);
router.get("/cuisines", verify, getUserFavoriteCuisines);
router.post("/register", register);
router.post("/login", login);
router.post("/add-cuisines", verify, addCuisinesToUser);
router.post("/refresh", refreshToken);

// LoggedIn User
router.post("/favorite-recipe", verify, addUserFavRecipe);
router.get("/favorite-recipes", verify, getUserFavRecipes);

module.exports = router;
