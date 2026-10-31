const dns = require("dns/promises");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const express = require("express");

const { connectDB } = require("./config/database");
const User = require("./models/user");
const { validateSignup, validateLogin } = require("./utils/validate");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
  try {
    validateLogin(req);

    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (isValidPassword) {
      // token generation
      const token = await jwt.sign({ _id: user._id }, "Dev@Tinder@123");

      res.cookie("token", token);
      res.send("Login successfull...");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    console.log("error", err.message);
    res.status(400).send(`Error Login: ${err.message}`);
  }
});

app.get("/profile", async (req, res) => {
  try {
    // Validate token
    const cookies = req.cookies;
    const { token } = cookies;

    if (!token) {
      throw new Error("Unauthorized!");
    }

    const decodeMessage = await jwt.verify(token, "Dev@Tinder@123");

    if (!decodeMessage) {
      throw new Error("Unauthorized! token not valid");
    }

    const user = await User.findById(decodeMessage._id);

    res.send(user);
  } catch (err) {
    console.log("Error", err.message);
    res.status(500).send("something went wrong...");
  }
});

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

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const allowedFields = ["gender", "age", "skills", "about", "photoUrl"];

    const isFieldsAllowed = Object.keys(req.body).every((key) =>
      allowedFields.includes(key),
    );

    if (!isFieldsAllowed) {
      throw new Error("Update not allowed");
    }

    if (data?.skills?.length > 10) {
      throw new Error("Skills must be less than 10");
    }

    const updatedUser = await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    }); // here we are directly passing the data with the userId.
    //  mongoose will not add/edit the data which is not in schema.It will automatically drop that.
    updatedUser
      ? res.send("User updated successfully")
      : res.status(400).send("Bad request");
  } catch (err) {
    console.log("Error", err);
    res.status(500).send("Update failed: " + err.message);
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
