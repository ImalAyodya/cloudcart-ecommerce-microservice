const express = require("express");
const router = express.Router();
const {
  register,
  login,
  me,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const auth = require("../middleware/auth");

// Auth routes
router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, me);

// CRUD (admin/compat)
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
