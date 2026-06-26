const express = require("express");
const router = express.Router();

const auth = require("../../middleware/authMiddleware"); // or the correct relative path
const {
  getProfile,
  updateProfile,
} = require("../controllers/profileController");

router.get("/", auth, getProfile);
router.put("/", auth, updateProfile);

module.exports = router;
