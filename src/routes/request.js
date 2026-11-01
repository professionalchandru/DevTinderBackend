const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const UserModel = require("../models/user");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const { status, toUserId } = req.params;
      const fromUserId = req.user._id;

      const allowedStatus = ["ignored", "intrested"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: `Invalid status` });
      }

      const toUser = await UserModel.findById(toUserId);

      if (!toUser) {
        return res.status(404).json({ message: `User not found` });
      }

      const isRequestExist = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (isRequestExist) {
        return res.status(400).json({ message: `Request Already Exisist.` });
      }

      const connectionRequest = await new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send connection request to yourself");
      }

      const data = await connectionRequest.save();

      res.json({
        message: `${req.user.firstName} is sent request to ${toUser.firstName}`,
        data,
      });
    } catch (err) {
      console.log("error", err.message);
      res.status(400).send(`Error: ${err.message}`);
    }
  },
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: `${status} not allowed`,
        });
      }

      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        status: "intrested",
        toUserId: loggedInUser._id,
      });

      if (!connectionRequest) {
        return res.status(404).json({
          message: `Connection request not found`,
        });
      }

      connectionRequest.status = status;

      const updatedRequest = await connectionRequest.save();

      res.json({
        message: `${loggedInUser.firstName} ${status} connection request`,
        data: updatedRequest,
      });
    } catch (err) {
      console.log("Error", err.message);
      res.status(400).json({
        message: `Error: ${err.message}`,
      });
    }
  },
);

module.exports = requestRouter;
