const mongoose = require("mongoose");

const connectionString =
  "mongodb+srv://chandruking1999_db_user:oIwZLjkqHYCzkbdK@devtindercluster.0ikemqn.mongodb.net/devTinder";

const connectDB = async () => {
  await mongoose.connect(connectionString);
};

module.exports = { connectDB };
