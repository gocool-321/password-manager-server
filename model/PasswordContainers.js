const mongoose = require('mongoose');

const passContainer = mongoose.Schema({
  passid: { type: String, required: true, unique: true },
  user_email: { type: String, required: true },
  title: { type: String, required: true },
  url: String,
  username: String,
  email: String,
  password: String,
  note: String,
  category: String,
  date_created: { type: Date, default: Date.now }
})

const PassContainer = mongoose.model('passwordcontainer', passContainer);
module.exports = PassContainer;