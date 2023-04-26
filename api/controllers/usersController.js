const User = require("../models/User");
const crypto = require("crypto");

module.exports.createUser = async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username: username });
    if (user) {
      return res.status(200).json({
        success: false,
        message: "Username is already taken!",
      });
    }
    if (!req.body.password) {
      req.body.password = crypto.randomBytes(5).toString("hex");
    } else if (req.body.password !== req.body.confirm_password) {
      return res.status(200).json({
        success: false,
        message: "Password and confirm password should be same!",
      });
    }
    const newUser = await User.create(req.body);
    console.log(newUser);
    // res.cookie("userId", newUser.id);
    return res.status(200).json({
      success: true,
      message: "User created successfully.",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

module.exports.createSession = async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.body.username,
    }).lean();
    if (!user || user.password !== req.body.password) {
      return res.status(200).json({
        success: false,
        message: "Invalid username/password.",
      });
    }
    const { password, ...otherData } = user;
    res.cookie("userId", otherData._id);
    return res.status(200).json({
      success: true,
      message: "Logged in successfully.",
      data: otherData,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

module.exports.getUserDetails = async (req, res) => {
  try {
    const { userId } = req.cookies;
    if (!userId) {
      return res.status(200).json({
        success: true,
        message: "You have been logged out, please login to continue!",
      });
    }
    const { password, ...otherData } = await User.findById(userId).lean();
    return res.status(200).json({
      success: true,
      data: otherData,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "Associate" });
    let allUserDetails = [];
    users.forEach((user) => {
      const { password, ...otherDetails } = user;
      allUserDetails.push(otherDetails._doc);
    });
    console.log(allUserDetails);
    return res.status(200).json({
      success: true,
      data: allUserDetails,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    const deleteUserId = req.query.userId;
    await User.findByIdAndDelete(deleteUserId);
    return res.status(200).json({
      success: true,
      message: "User deleted successfully!",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const updateUserId = req.body.userId;
    await User.findByIdAndUpdate(updateUserId, {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });
    return res.status(200).json({
      success: true,
      message: "User details updated successfully!",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};
