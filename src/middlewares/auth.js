const adminAuthMiddleware = (req, res, next) => {
  const token = "xyz";
  const isAdminAuthourized = token === "xyz";
  if (!isAdminAuthourized) {
    res.status(401).send("Unauthourized...");
  } else {
    next();
  }
};

const userAuthMiddleware = (req, res, next) => {
  const token = "xyz";
  const userAuthourized = token === "xyz";
  if (!userAuthourized) {
    res.status(401).send("Unauthourized...");
  } else {
    next();
  }
};

module.exports = { adminAuthMiddleware, userAuthMiddleware };
