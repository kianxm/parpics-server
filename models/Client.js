const { model, Schema } = require("mongoose");

const ClientSchema = new Schema({
  name: String,
  link: String,
  accessCode: String,
  location: String,
  date: String,
  hasPaid: Boolean,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  photoCount: Number,
  userId: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = model("Client", ClientSchema);
