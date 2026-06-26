const express = require("express");

const router = express.Router();

const auth = require("../../middleware/authMiddleware");
const admin = require("../../middleware/adminMiddleware");
const {
  getDashboard,deleteUser,
} = require("../controllers/adminController");

router.get("/dashboard", auth, admin, getDashboard);
router.delete("/user/:id", auth, admin, deleteUser);
module.exports = router;