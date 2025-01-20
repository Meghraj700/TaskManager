const express = require('express');
const router = express.Router();
const { authenticateToken } = require("./auth");
const {
    signUp,
    logIn,
    getUserDetails
} = require('../controllers/userController');

router.post("/sign-in", signUp);
router.post("/log-in", logIn);
router.get("/get-user-detail", authenticateToken, getUserDetails);

module.exports = router;
