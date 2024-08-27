const { model, Schema } = require("mongoose");

const UserSchema = new Schema({
  name: { type: String, required: false },
  username: { type: String, unique: true, required: false },
  email: { type: String, unique: true },
  password: { type: String },
  token: { type: String },
});

module.exports = model("User", UserSchema);
