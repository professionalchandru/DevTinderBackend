const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");

const userRouter = express.Router();

const POPULATE_SAFE_DATA =
  "firstName lastName age gender about photoUrl skills";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequestList = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "intrested",
    }).populate("fromUserId", POPULATE_SAFE_DATA);
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

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const matchedList = await ConnectionRequestModel.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", POPULATE_SAFE_DATA)
      .populate("toUserId", POPULATE_SAFE_DATA);

    const data = matchedList.map((item) => {
      if (item.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return item.toUserId;
      }
      return item.fromUserId;
    });

    res.json({
      messge: "Matched List",
      data: data,
    });
  } catch (err) {
    console.log("Error on path: /user/requests/received - " + err.message);
    res.status(400).json({
      message: err.message,
    });
  }
});

module.exports = userRouter;
