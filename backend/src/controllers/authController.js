const User = require("../models/User");
const Profile = require("../models/Profile"); // Imported Profile model
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    // Automatically create the baseline health profile document for the new user
    await Profile.create({
      user: user._id,
      name: user.name,
      goal: "Improve daily wellness",
      waterTarget: 8,
      sleepTarget: 8,
      activityLevel: "Moderate",
      age: null,
      height: null,
      weight: null,
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token: generateToken(user._id, user.role),
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    res.json({
      success: true,
      token: generateToken(user._id, user.role),
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};