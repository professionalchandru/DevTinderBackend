const validator = require("validator");

const validateSignup = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || firstName.length < 4) {
    throw new Error("First name miniumn 4 characters is required ");
  } else if (!validator.isEmail(email)) {
    throw new Error("Please enter valid email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter strong password");
  }
};

const validateLogin = (req) => {
  const { email } = req.body;
  if (!validator.isEmail(email)) {
    throw new Error("Please enter valid email");
  }
};

module.exports = { validateSignup, validateLogin };
