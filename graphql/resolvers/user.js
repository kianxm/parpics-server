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
  },
  Mutation: {
    async registerUser(_, { registerInput: { username, email, password } }) {
      const emailAlreadyExists = await User.findOne({ email });
      const usernameAlreadyExists = await User.findOne({ username });
      if (emailAlreadyExists || usernameAlreadyExists) {
        throw new ApolloError(
          "Username or email already exists: " + email,
          "USER_ALREADY_EXISTS"
        );
      }

      const encryptedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password: encryptedPassword,
      });

      const token = jwt.sign(
        {
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
        const token = jwt.sign(
          {
            user_id: user._id,
            email,
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
  },
};
