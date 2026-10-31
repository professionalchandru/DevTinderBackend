const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token || token === null) {
      throw new Error("Invalild token");
    }

    const decodeMessage = await jwt.verify(token, "Dev@Tinder@123");

    const { _id } = decodeMessage;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("Unauthouized user");
    }
    req.user = user;

    next();
  } catch (err) {
    console.log("Error", err);
    res.status(401).send("Error: " + err.message);
  }
};

module.exports = { userAuth };
