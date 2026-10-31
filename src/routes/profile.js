const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");

const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    console.log("Error", err.message);
    res.status(500).send("something went wrong...");
  }
});

profileRouter.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    console.log("Error", err.message);
    res.status(500).send("something went wrong...");
  }
});

module.exports = profileRouter;
