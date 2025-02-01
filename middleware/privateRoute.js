// verify - Middleware for JWT authentication

const jwt = require("jsonwebtoken");

module.exports = async function (req, res, next) {
  const token = req.header("auth-token");

  if (!token) {
    return res.status(401).send("Access Denied");
  }

  try {
    const tokenSecret =
      (await getParameter("TOKEN_SECRET")) || process.env.TOKEN_SECRET;
    const verified = jwt.verify(token, tokenSecret);
    req.user = verified;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      const refreshToken = req.header("refresh-token");
      if (!refreshToken) return res.status(401).send("Access Denied");

      try {
        const refreshTokenSecret =
          (await getParameter("TOKEN_SECRET")) || process.env.TOKEN_SECRET;
        const decoded = jwt.verify(refreshToken, refreshTokenSecret);

        const newAccessToken = generateAccessToken(decoded._id);
        res.setHeader("auth-token", newAccessToken);
        req.user = decoded;
        next();
      } catch (error) {
        res.status(401).send("Invalid refresh token!");
      }
    } else {
      res.status(401).send("Invalid token!");
    }
  }
};

// Helper Fn to generate an access token
async function generateAccessToken(userId) {
  const tokenSecret =
    (await getParameter("TOKEN_SECRET")) || process.env.TOKEN_SECRET;
  return jwt.sign({ _id: userId }, tokenSecret, {
    expiresIn: "50m",
  });
}
