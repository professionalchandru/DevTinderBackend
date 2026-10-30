const dns = require("dns/promises");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const express = require("express");

const { connectDB } = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    console.log("Error", err.message);
    res.status(500).send("something went wrong...");
  }
});

app.get("/user", async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.find({ email: email });
    if (!user.length) {
      res.status(404).send("User not found");
    } else {
      res.status(200).send(user);
    }
  } catch (err) {
    console.log("Error", err);
    res.status(500).send("something went wrong...");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (err) {
    console.log("Error", err);
    res.status(500).send("something went wrong...");
  }
});

app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate({ _id: userId }, data); // here we are directly passing the data with the userId.
    //  mongoose will not add/edit the data which is not in schema.It will automatically drop that.
    updatedUser
      ? res.send("User updated successfully")
      : res.status(400).send("Bad request");
  } catch (err) {
    console.log("Error", err);
    res.status(500).send("something went wrong...");
  }
});

app.post("/signup", async (req, res) => {
  const user = new User(req.body);

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
