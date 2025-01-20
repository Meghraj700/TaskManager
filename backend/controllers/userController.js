const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// User SignUp
const signUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashPass = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashPass
        });
        await newUser.save();
        res.status(200).json({ message: "SignUp Successfully" });
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: "Internal Server Error" });
    }
};

// User Login
const logIn = async (req, res) => {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });

    if (!existingUser) {
        return res.status(400).json({ message: "Invalid Credentials" });
    }

    bcrypt.compare(password, existingUser.password, (err, data) => {
        if (data) {
            const authClaims = [{ name: username }, { jti: jwt.sign({}, "SECRETKEY") }];
            const token = jwt.sign({ authClaims }, "SECRETKEY", { expiresIn: "2d" });
            res.status(200).json({ id: existingUser._id, token });
        } else {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
    });
};

// Get User Details
const getUserDetails = async (req, res) => {
    try {
        const { _id } = req.headers;

        if (!_id) {
            return res.status(400).json({ message: "User ID not provided in headers" });
        }

        const user = await User.findById(_id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const authClaims = [{ name: user.username }, { jti: jwt.sign({}, "SECRETKEY") }];
        const token = jwt.sign({ authClaims }, "SECRETKEY", { expiresIn: "2d" });

        res.status(200).json({ result: user, message: "User Details Retrieved", token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    signUp,
    logIn,
    getUserDetails
};
