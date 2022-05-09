const mongoose = require("mongoose");

const docSchema = mongoose.Schema({
  docid: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  docTitle: { type: String, required: true },
  query: { type: String, required: true },
  hashtags: String,
  definition: String,
  date_created: { type: Date, default: Date.now },
});

const Doc = mongoose.model("docs", docSchema);
module.exports = Doc;
