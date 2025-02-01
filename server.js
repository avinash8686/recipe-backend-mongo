require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const rfs = require("rotating-file-stream");
const cors = require("cors");
const { getParameter } = require("./Config/aws-creds.js");
const mongoose = require("mongoose");
const authRoute = require("./Routes/AuthRoutes");
const recipeRoute = require("./Routes/RecipesRoutes.js");
const cuisineRoute = require("./Routes/CuisinesRoutes.js");
const app = express();

// create a rotating write stream
var accessLogStream = rfs.createStream("access.log", {
  interval: "1d",
  path: path.join(__dirname, "log"),
});

// setup the logger
app.use(morgan("combined", { stream: accessLogStream }));
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("<h1>welcome</h1>");
});
app.use("/api/user/", authRoute);
app.use("/api/recipe/", recipeRoute);
app.use("/api/cuisine/", cuisineRoute);

const PORT = process.env.PORT || 3001;
const runApp = async () => {
  const MONGO_URL = (await getParameter("MONGO_URL")) || process.env.MONGO_URL;

  // Connect to DB
  mongoose
    .connect(MONGO_URL)
    .then(() => {
      app.listen(PORT, (req, res) => {
        console.log(`Server is running on ${PORT}`);
      });
    })
    .catch((err) => console.log(err));
};

runApp();
module.exports = app;
