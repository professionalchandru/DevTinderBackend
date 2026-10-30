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

// b is optional here. this route work for 'abc' and 'ac' both
// app.get("/ab?c", (req, res) => {
//   //statements
// });

// i can add as many b's i want. this route work for 'abc' and 'abbbbbbc', 'abbc', ....
// app.get("/ab+c", (req, res) => {
//   //statements
//   return;
// });

// here i can wirte anything between ab and cd. ex: abfjlkasdjfdskacd. it should start with ab and end with cd.
app.get("/ab*cd", (req, res) => {
  //statements
});

// Regular expression is also possible in route path.

app.get("/user/:userId/:name", (req, res) => {
  console.log("dyanmic route used by params", req.params);
  res.end();
});

app.get("/user1", (req, res) => {
  console.log("query is used to capture queryparams in url", req.query);
  res.end();
});

app.listen(7777, () => {
  console.log("App is listening on port 7777");
});
