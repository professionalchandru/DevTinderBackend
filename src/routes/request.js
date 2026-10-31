const express = require("express");
const { userAuth } = require("../middlewares/auth");

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, (req, res) => {
  try {
    const user = req.user;
    res.send(`Connection request sent by ${user.firstName}`);
  } catch (err) {
    console.log("error", err.message);
    res.status(400).send(`Error Login: ${err.message}`);
  }
});

module.exports = requestRouter;
