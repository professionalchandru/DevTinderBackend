const dns = require("dns/promises");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const express = require("express");

const { connectDB } = require("./config/database");
const User = require("./models/user");

const app = express();

app.post("/signup", async (req, res) => {
  const user = new User({
    firtName: "Chandra",
    lastName: "Manikandan",
    email: "chandru@gmail.com",
    password: "abcd",
  });

  try {
    await user.save();
    res.send("User Saved Successfully");
  } catch (err) {
    console.log("error", err.message);
    res.status(400).send(`Error saving the user: ${err.message}`);
  }
});

connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(7777, () => {
      console.log("App is listening on port 7777");
    });
  })
  .catch((err) => {
    console.log("err", err.message);
    console.log("Database connection failed...");
  });
