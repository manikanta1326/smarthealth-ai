const jwt = require("jsonwebtoken");
const User = require("../src/models/User");

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token)
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
};