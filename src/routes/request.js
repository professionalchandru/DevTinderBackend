const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

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

      const toUser = await User.findById(toUserId);

      if (!toUser) {
        return res.status(404).json({ message: `User not found` });
      }

      const isRequestExist = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (isRequestExist) {
        return res.status(400).json({ message: `Request Already Exisist.` });
      }

      const connectionRequest = await new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

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

module.exports = requestRouter;
