const Profile = require("../models/Profile");
const User = require("../models/User"); // Imported User model for old profile auto-repair lookups

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    let profile = await Profile.findOne({ user: userId });

    // Auto-repair missing profile documents for older legacy users
    if (!profile) {
      const user = await User.findById(userId);
      
      profile = await Profile.create({
        user: userId,
        name: user ? user.name : (req.user.name || "User"),
        goal: "Improve daily wellness",
        waterTarget: 8,
        sleepTarget: 8,
        activityLevel: "Moderate",
        age: null,
        height: null,
        weight: null,
      });
    }

    res.json({
      success: true,
      data: profile,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      req.body,
      {
        new: true,
        upsert: true,
      }
    );

    res.json({
      success: true,
      data: profile,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};