const { model, Schema } = require("mongoose");

const UserSchema = new Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: { type: String },
  token: { type: String },
});

module.exports = model("User", UserSchema);
