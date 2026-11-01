const express = require("express");
const { userAuth } = require("../middlewares/auth");
const UserModel = require("../models/user");
const { validateUserEdit } = require("../utils/validate");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
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
    const users = await UserModel.find({});
    res.status(200).send(users);
  } catch (err) {
    console.log("Error", err.message);
    res.status(500).send("something went wrong...");
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    validateUserEdit(req);

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    const updatedUserDeatils = new UserModel(loggedInUser);
    await updatedUserDeatils.save();

    res.json({
      message: `${updatedUserDeatils.firstName} profile is updated successfully `,
      data: updatedUserDeatils,
    });
  } catch (err) {
    console.log("Error", err.message);
    res.status(400).send("Error: " + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const isValidPassword = await user.validatePassword(
      req.body.currentPassword,
    );
    if (!isValidPassword) {
      throw new Error("Password not match");
    }
    const hashedPassword = await user.hashPassword(req.body.newPassword);
    const updatedUserDeatils = await UserModel.findOneAndUpdate(
      { _id: user._id },
      {
        password: hashedPassword,
      },
    );
    res.json({
      message: "Password updated successfully",
      data: user._id,
    });
  } catch (err) {
    console.log("Error", err.message);
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = profileRouter;
