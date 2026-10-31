const express = require("express");
const bcrypt = require("bcrypt");
const { validateSignup, validateLogin } = require("../utils/validate");
const User = require("../models/user");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    //validate the fields
    validateSignup(req);

    const {
      firstName,
      lastName,
      email,
      password,
      gender,
      about,
      photoUrl,
      skills,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      gender,
      about,
      photoUrl,
      skills,
    });

    await user.save();
    res.send("User Saved Successfully");
  } catch (err) {
    console.log("error", err.message);
    res.status(400).send(`Error saving the user: ${err.message}`);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    validateLogin(req);

    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isValidPassword = await user.validatePassword(password);
    if (isValidPassword) {
      // token generation
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send("Login successfull...");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    console.log("error", err.message);
    res.status(400).send(`Error Login: ${err.message}`);
  }
});

module.exports = authRouter;
