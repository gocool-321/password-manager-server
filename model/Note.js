const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({
    noteid: { type: String, required: true, unique: true },
    user_email: { type: String, required: true },
    notebookid: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: String,
    description: String,
    date_created: { type: Date, default: Date.now }
})

const Note = mongoose.model('notes', noteSchema);
module.exports = Note;