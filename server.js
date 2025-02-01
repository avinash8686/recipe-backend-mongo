require("dotenv").config();

const express = require("express");

const morgan = require("morgan");
const path = require("path");

const rfs = require("rotating-file-stream");

const cors = require("cors");

const app = express();
app.use(morgan("combined"));

// create a rotating write stream
var accessLogStream = rfs.createStream("access.log", {
  interval: "1d",
  path: path.join(__dirname, "log"),
});

// setup the logger
app.use(morgan("combined", { stream: accessLogStream }));

app.use(cors());
app.use(express.json());

const mongoose = require("mongoose");

const PORT = process.env.PORT || 3001;

const MONGO_URL = process.env.MONGO_URL;

// Import Routes
const authRoute = require("./Routes/AuthRoutes");
const recipeRoute = require("./Routes/RecipesRoutes.js");
const cuisineRoute = require("./Routes/CuisinesRoutes.js");

app.get("/", (req, res) => {
  res.send("<h1>welcome</h1>");
});

app.use("/api/user/", authRoute);
app.use("/api/recipe/", recipeRoute);
app.use("/api/cuisine/", cuisineRoute);

const environment = process.env.NODE_ENV;

// Connect to DB
mongoose
  .connect(MONGO_URL)
  .then(() => {
    environment === "development"
      ? app.listen(PORT, (req, res) => {
          console.log(`Server is running on ${PORT}`);
        })
      : null;
  })
  .catch((err) => console.log(err));
// export the app for vercel serverless functions
module.exports = app;
