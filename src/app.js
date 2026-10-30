const express = require("express");

const app = express();

// app.use(
//   "/user",
//   (req, res, next) => {
//     next(); // next will move to the next route handler
//     res.send("user"); // it will throw error. because next() called other route handler and response already sent to client
//   },
//   (req, res, next) => {
//     res.send("hi");
//   },
// );

// app.use("/user", (req, res, next) => {
//   next(); // this will also throw cannot get /user error in postman since there is no route handler after this
// });

app.use(
  "/user",
  (req, res, next) => {
    console.log("1");
    next();
  },
  [
    (req, res, next) => {
      console.log("2");
      next();
    },
  ],
  (req, res, next) => {
    res.send("hi user"); // No error since there is perfect res.send is there
  },
);

app.listen(7777, () => {
  console.log("App is listening on port 7777");
});
