const { model, Schema } = require("mongoose");

const PhotoSchema = new Schema(
  {
    name: { type: String, required: false },
    createdAt: { type: String, required: false },
    format: { type: String, required: false },
    bytes: { type: Number, required: false },
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    version: { type: Number, required: true },
    assetId: { type: String, required: true },
  },
  { _id: false }
);

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
  photos: [PhotoSchema],
});

module.exports = model("Client", ClientSchema);
