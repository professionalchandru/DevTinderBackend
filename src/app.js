const express = require("express");
const {
  adminAuthMiddleware,
  userAuthMiddleware,
} = require("./middlewares/auth");

const app = express();

// ** MIDDLEWARE **
// middle where means the functions which will be called/executed from the route is reached till the res send to the client.
// the function which is sending response back is known as request handler. other functions just do some work and using next() to forward is known as middlewares

app.use("/admin", adminAuthMiddleware); //here all the request first encounter this middleware. if it authourized then only it will allow to the next requesthandler.
// With this app.use middleware we can able to reuse this check for all the methods like get, post, put....

app.get("/admin/getAlldata", (req, res, next) => {
  res.send([
    {
      name: "chandru",
    },
    {
      name: "mani",
    },
  ]);
});

app.get("/user/login", (req, res, next) => {
  //handle login flow.
  // it is not requried any authcheck
});

app.get("/user/list", userAuthMiddleware, (req, res, next) => {
  // here just we used the approach of multiple reqest handler in the same place.
  res.send([
    {
      name: "chandru1",
    },
    {
      name: "mani1",
    },
  ]);
});

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

// app.use(
//   "/user",
//   (req, res, next) => {
//     console.log("1");
//     next();
//   },
//   [
//     (req, res, next) => {
//       console.log("2");
//       next();
//     },
//   ],
//   (req, res, next) => {
//     res.send("hi user"); // No error since there is perfect res.send is there
//   },
// );

// app.get("/user", (req, res, next) => {
//   console.log("first");
//   res.send("user");
//   next();
// });

// app.get("/user", (req, res, next) => {
//   console.log("second");
//   res.send("user");
// });

// ** ERROR HANDLING **
// Always use a try catch block to handle the error and send appropirate error response.
// we can use the wild card error handling as fallback. that time err is the first param. other params will be followed that

// app.get("/a", (req,res) => {
//   throw new Error("abcd");
//   res.send("hi"); // this will expose the random things in client. so always use the try and catch block to avoid it.
// });

app.get("/a", (req, res) => {
  try {
    throw new Error("abcd");
    res.send("hi"); // this will expose the random things in client. so always use the try and catch block to avoid it.
  } catch (err) {
    // Log the error
    res.status(500).send("Something went wrong");
  }
});

app.use("/", (err, req, res, next) => {
  // Here you notice for 4 params, i always use the err as first param. this is a wild card error handleing.
  if (err) {
    // Log the error
    res.status(500).send("Something went wrong");
  }
});

app.listen(7777, () => {
  console.log("App is listening on port 7777");
});
