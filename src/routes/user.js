const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");

const userRouter = express.Router();

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequestList = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "intrested",
    }).populate(
      "fromUserId",
      "firstName lastName age gender about photoUrl skills",
    );
    // }).populate("fromUserId", ["firsName", "lastName", "age", "gender", "about", "photoUrl"); // can be written like this also

    res.json({
      message: "Connectionn requests fetched successfully",
      data: connectionRequestList,
    });
  } catch (err) {
    console.log("Error on path: /user/requests/received - " + err.message);
    res.status(400).json({
      message: err.message,
    });
  }
});

module.exports = userRouter;
