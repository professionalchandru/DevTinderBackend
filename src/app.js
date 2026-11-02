require("dotenv").config();
const dns = require("dns/promises");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const express = require("express");

const { connectDB } = require("./config/database");

const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter, profileRouter, requestRouter, userRouter);

connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(process.env.PORT || 7777, () => {
      console.log("App is listening on port : ", process.env.PORT || 7777);
    });
  })
  .catch((err) => {
    console.log("err", err.message);
    console.log("Database connection failed...");
  });
