  const mongoose = require("mongoose");

  const profileSchema = new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
      },

      name: String,

      age: Number,

      height: Number,

      weight: Number,

      goal: String,

      waterTarget: Number,

      sleepTarget: Number,

      activityLevel: String,

      photo: String,
    },
    {
      timestamps: true,
    }
  );

  module.exports = mongoose.model("Profile", profileSchema);