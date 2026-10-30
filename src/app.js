const express = require("express");

const app = express();

app.get("/user", (req, res) => {
  res.send({ firstName: "chandru", lasName: "manikandan" });
});

app.post("/user", (req, res) => {
  // Some DB operation
  res.send("User created successfully");
});

app.delete("/user", (req, res) => {
  res.send("User deleted sucessfully");
});

app.listen(7777, () => {
  console.log("App is listening on port 7777");
});
