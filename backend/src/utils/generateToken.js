const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  // Signs a new JWT token using the secret from your .env file
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30 days", // Token will be valid for 30 days
  });
};

module.exports = generateToken;