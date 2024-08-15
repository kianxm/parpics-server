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
});

module.exports = model("Client", ClientSchema);
