const User = require("../model/User.cjs");
const bcrypt = require("bcryptjs");

const getAllUser = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
  } catch (err) {
    res.status(500).send(err);
  }
  if (!users) {
    res.status(404).send("No Users found");
  }
  return res.status(200).json({ users });
};

const signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  var existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    res.status(500).send(err);
  }

  if (existingUser) {
    return res.status(400).send("User already exists, login instead");
  }

  const hashedPassword = bcrypt.hashSync(password);

  const user = new User({
    name,
    email,
    password: hashedPassword,
    blogs: []
  });

  try {
    await user.save();
  } catch (err) {
    res.status(500).send(err);
  }
  return res.status(201).json({ user });
};


const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Retrieve user from the database
    const existingUser = await User.findOne({ email });

    // Check if user exists
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare passwords
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Password is correct, login successful
    return res.status(200).json({ message: "Login successful" });

  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getAllUser, signup, login };
