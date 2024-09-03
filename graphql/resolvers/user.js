require("dotenv").config();

const User = require("../../models/User");
const { ApolloError } = require("apollo-server-errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports = {
  Query: {
    user: (_, { id }) => User.findById(id),
    async getUserByUsername(_, { username }) {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    },
    async getUserById(_, { userId }) {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    },
  },
  Mutation: {
    async registerUser(
      _,
      { registerInput: { name, username, email, password } }
    ) {
      if (!name || !username || !email || !password) {
        throw new ApolloError("All fields are required", "MISSING_FIELDS");
      }

      const passwordRegex =
        /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/gm;

      if (!password.match(passwordRegex)) {
        throw new ApolloError(
          "Password must be between 8 to 16 characters and contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character",
          "INVALID_PASSWORD"
        );
      }

      const emailRegex = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm;

      if (!email.match(emailRegex)) {
        throw new ApolloError("Invalid email", "INVALID_EMAIL");
      }

      const emailAlreadyExists = await User.findOne({ email });
      const usernameAlreadyExists = await User.findOne({ username });

      if (emailAlreadyExists) {
        throw new ApolloError(
          "Email already exists: " + email,
          "USER_ALREADY_EXISTS"
        );
      }

      if (usernameAlreadyExists) {
        throw new ApolloError(
          "Username already exists: " + username,
          "USER_ALREADY_EXISTS"
        );
      }

      const encryptedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        name,
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password: encryptedPassword,
      });

      const token = jwt.sign(
        {
          name,
          username,
          user_id: newUser._id,
          email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "2h",
        }
      );

      newUser.token = token;

      const res = await newUser.save();
      return {
        id: res.id,
        ...res._doc,
      };
    },
    async loginUser(_, { loginInput: { email, password } }) {
      const user = await User.findOne({ email });
      if (user && bcrypt.compare(password, user.password)) {
        // Return user data after sign in
        const token = jwt.sign(
          {
            user_id: user._id,
            email,
            username: user.username,
            name: user.name,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "2h",
          }
        );
        user.token = token;

        return {
          id: user.id,
          ...user._doc,
        };
      } else {
        throw new ApolloError("Invalid credentials", "INVALID_CREDENTIALS");
      }
    },
    async registerViewer(_, { registerInput: { name, email, password } }) {
      if (!name || !email || !password) {
        throw new ApolloError("All fields are required", "MISSING_FIELDS");
      }

      const passwordRegex =
        /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/gm;

      if (!password.match(passwordRegex)) {
        throw new ApolloError(
          "Password must be between 8 to 16 characters and contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character",
          "INVALID_PASSWORD"
        );
      }

      const emailRegex = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm;

      if (!email.match(emailRegex)) {
        throw new ApolloError("Invalid email", "INVALID_EMAIL");
      }

      const emailAlreadyExists = await User.findOne({ email });

      if (emailAlreadyExists) {
        throw new ApolloError(
          "Email already exists: " + email,
          "USER_ALREADY_EXISTS"
        );
      }

      const encryptedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        name,
        email: email.toLowerCase(),
        password: encryptedPassword,
      });

      const token = jwt.sign(
        {
          name,
          user_id: newUser._id,
          email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "2h",
        }
      );

      newUser.token = token;

      const res = await newUser.save();
      return {
        id: res.id,
        ...res._doc,
      };
    },
  },
};
