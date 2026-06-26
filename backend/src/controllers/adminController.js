const User = require("../models/User");
const Profile = require("../models/Profile");
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (req.user._id.toString() === id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account.",
      });
    }

    await User.findByIdAndDelete(id);
    await Profile.findOneAndDelete({ user: id });

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
exports.getDashboard = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    const profiles = await Profile.find().populate(
      "user",
      "name email role"
    );

    let totalBMI = 0;
    let bmiUsers = 0;
    let highRiskUsers = 0;

    profiles.forEach((profile) => {
      if (profile.height && profile.weight) {
        const bmi =
          profile.weight /
          Math.pow(profile.height / 100, 2);

        totalBMI += bmi;
        bmiUsers++;

        if (bmi >= 30) {
          highRiskUsers++;
        }
      }
    });

    const avgBMI =
      bmiUsers > 0
        ? (totalBMI / bmiUsers).toFixed(1)
        : 0;

    res.json({
      success: true,

      stats: {
        totalUsers: users.length,
        totalProfiles: profiles.length,
        avgBMI,
        highRiskUsers,
      },

      users,
      profiles,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};