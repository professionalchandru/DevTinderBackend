const validator = require("validator");
const bcrypt = require("bcrypt");

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

const validateUserEdit = (req) => {
  const editableFileds = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "about",
    "photoUrl",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    editableFileds.includes(field),
  );
  if (!isEditAllowed) {
    throw new Error("Edit not allowed");
  }
};

const validateChangePassword = async (req) => {
  const currentPassword = req.body.currentPassword;

  const currentHashedPassword = req.user.password;

  const isPasswordVerified = await bcrypt.compare(
    currentPassword,
    currentHashedPassword,
  );

  if (!isPasswordVerified) {
    throw new Error("Invalid current password");
  }
};

module.exports = {
  validateSignup,
  validateLogin,
  validateUserEdit,
  validateChangePassword,
};
