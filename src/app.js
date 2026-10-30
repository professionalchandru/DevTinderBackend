const express = require("express");

const app = express();

app.use("/test", (req, res) => {
  res.send("test");
});

app.use("/hello", (req, res) => {
  res.send("Hello world");
});

app.use("/", (req, res) => {
  res.send("Dashboard1");
});

app.listen(7777, () => {
  console.log("App is listening on port 7777");
});
