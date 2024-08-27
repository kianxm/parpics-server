const { model, Schema } = require("mongoose");

const CommentSchema = new Schema({
  author: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

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
    isFavorite: { type: Boolean, required: false },
    comments: [CommentSchema],
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
  comments: [CommentSchema],
  websiteTemplate: { type: Number, default: 0 },
});

module.exports = model("Client", ClientSchema);
