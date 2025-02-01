const {
  registerValidation,
  loginValidation,
} = require("../validation/User/validation");
const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Cuisines = require("../model/Cuisine");
const Likes = require("../model/Likes");
const Recipes = require("../model/Recipe");
var _ = require("underscore");
const { getParameter } = require("../Config/aws-creds");

dotenv.config();

//function to generate access token
async function generateAccessToken(userId) {
  const tokenSecret =
    (await getParameter("TOKEN_SECRET")) || process.env.TOKEN_SECRET;
  return jwt.sign({ _id: userId }, tokenSecret);
}

const register = async (req, res) => {
  const { name, email, password, isAdmin } = req.body.data;

  const { error } = registerValidation(req.body.data);
  if (error) {
    return res.status(400).send({ msg: "Validation failed!!!" });
  }

  // Check if user already exists
  const emailExists = await User.findOne({ email: email });
  if (emailExists) {
    return res.status(400).send({ msg: "Email already exists" });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create a new user
  const user = new User({
    name: name,
    email: email,
    password: hashedPassword,
    isAdmin: isAdmin,
  });

  try {
    const savedUser = await user.save();
    res.send({ user: user._id, msg: "Registration Successful" });
  } catch (error) {
    res.status(400).send({ msg: "Something went wrong, Try Again" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body.data;
    // Validate the data
    const { error } = loginValidation(req.body.data);
    if (error) {
      return res.status(400).send({ msg: "Validation failed!!!", error });
    }

    // Check if email exists
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).send({ msg: "Email doesn't exist" });

    // Check if password is correct
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.status(400).send({ msg: "Email or password is wrong" });
    }

    // Create & assign an access token
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.json({
      user: user,
      accessToken,
      refreshToken,
      msg: "Login successful",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const refreshToken = async (req, res) => {
  const refreshToken = req.body.refreshToken;

  // Check if the refresh token is valid
  try {
    const refreshTokenSecret =
      (await getParameter("TOKEN_SECRET")) || process.env.TOKEN_SECRET;
    const decoded = jwt.verify(refreshToken, refreshTokenSecret);

    // Create and assign a new access token
    const accessToken = generateAccessToken(decoded._id);

    res.json({ accessToken });
  } catch (error) {
    res.status(401).send("Invalid refresh token");
  }
};

// Helper function to generate a refresh token
async function generateRefreshToken(userId) {
  const refreshTokenSecret =
    (await getParameter("REFRESH_TOKEN_SECRET")) ||
    process.env.REFRESH_TOKEN_SECRET;
  return jwt.sign({ _id: userId }, refreshTokenSecret);
}

// CREATE: Create a recipe
const addCuisinesToUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.user._id, {
      cuisines: req.body,
      initialLogin: false,
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUserFavoriteCuisines = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const favCuisines = await Cuisines.find({ _id: { $in: user.cuisines } });
    res.status(200).json(favCuisines);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addUserFavRecipe = async (req, res) => {
  try {
    const recipeLikeExists = await Likes.find({
      recipeId: req.body.recipeId,
    });

    let likeStatus;
    if (!_.isEmpty(recipeLikeExists)) {
      likeStatus = await Likes.deleteMany({
        recipeId: req.body.recipeId,
      });
    } else {
      likeStatus = await Likes.create({
        userId: req.user._id,
        cuisineId: req.body.cuisineId,
        recipeId: req.body.recipeId,
      });
    }

    res.status(200).json(likeStatus);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUserFavRecipes = async (req, res) => {
  try {
    const recipes = await Likes.find({
      userId: req.user._id,
    }).distinct("recipeId");

    const allFavRecipes = await Recipes.find({
      _id: {
        $in: recipes,
      },
    });
    res.status(200).json(allFavRecipes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
module.exports = {
  register,
  login,
  refreshToken,
  addCuisinesToUser,
  getUserDetails,
  getUserFavoriteCuisines,
  addUserFavRecipe,
  getUserFavRecipes,
};
