const mongoose = require('mongoose');

const notebookSchema = mongoose.Schema({
	notebookid: { type: String, required: true, unique: true },
	user_email: { type: String, required: true },
	title: { type: String, required: true },
	date_created: { type: Date, default: Date.now }
})

const Notebook = mongoose.model('notebooks', notebookSchema);
module.exports = Notebook;