require("dotenv").config();

const User = require("../../models/User");
const { ApolloError } = require("apollo-server-errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports = {
  Query: {
    user: (_, { id }) => User.findById(id),
  },
  Mutation: {
    async registerUser(_, { registerInput: { email, password } }) {
      const oldUser = await User.findOne({ email });
      if (oldUser) {
        throw new ApolloError(
          "A user with that email already exists " + email,
          "USER_ALREADY_EXISTS"
        );
      }

      const encryptedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        email: email.toLowerCase(),
        password: encryptedPassword,
      });

      const token = jwt.sign(
        {
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
