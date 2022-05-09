const express = require("express");
const router = express();
const { v4: uuidv4 } = require("uuid");

const Notebook = require("../model/Notebook");
const Note = require("../model/Note");

router
  .route("/notebook")
  .get(async (req, res) => {
    let user = req.session.userdata;
    try {
      if (!user) throw "nosession";
      // get notebooks list
      const notebook_list = await Notebook.find({
        user_email: req.session.userdata.email,
      });
      res.json({
        notebookList:
          notebook_list && notebook_list.length > 0 ? notebook_list : [],
      });
    } catch (error) {
      console.log(error);
      if (error == "nosession") res.json({ loggedin: false });
      else res.json({ notebookList: false });
    }
  })
  .post(async (req, res) => {
    let user = req.session.userdata;
    try {
      if (!user) throw "nosession";
      const newNotebook = new Notebook({
        notebookid: uuidv4(),
        user_email: req.session.userdata.email,
        title: req.body.title,
      });
      // save new Notebook
      const notebook_resp = await newNotebook.save();
      res.json({ notebook_added: notebook_resp ? notebook_resp : false });
    } catch (error) {
      console.log(error);
      if (error == "nosession") res.json({ loggedin: false });
      else res.json({ notebook_added: false });
    }
  })
  .put(async (req, res) => {
    let user = req.session.userdata;
    try {
      if (!user) throw "nosession";
      const notebook_resp = await Notebook.updateOne(
        { notebookid: req.body.notebookid },
        {
          title: req.body.title,
        }
      );
      res.json({ updated: notebook_resp.nModified == 1 ? true : false });
    } catch (error) {
      console.log(error);
      if (error == "nosession") res.json({ loggedin: false });
      else res.json({ updated: false });
    }
  })
  .delete(async (req, res) => {
    let user = req.session.userdata;
    try {
      if (!user) throw "nosession";
      const delete_notebook = await Notebook.deleteOne({
        notebookid: req.body.notebookid,
      });
      const delete_notes = await Note.deleteMany({
        notebookid: req.body.notebookid,
      });
      res.json({ deleted: delete_notebook.n === 1 ? true : false });
    } catch (error) {
      console.log(error);
      if (error == "nosession") res.json({ loggedin: false });
      else res.json({ deleted: false });
    }
  });

router
  .route("/note/:notebookid")
  .get(async (req, res) => {
    let user = req.session.userdata;
    try {
      if (!user) throw "nosession";
      // get notes list
      const note_list = await Note.find({
        user_email: req.session.userdata.email,
        notebookid: req.params.notebookid,
      });
      res.json({
        notesList: note_list && note_list.length > 0 ? note_list : [],
      });
    } catch (error) {
      console.log(error);
      if (error == "nosession") res.json({ loggedin: false });
      else res.json({ notesList: false });
    }
  })
  .post(async (req, res) => {
    let user = req.session.userdata;
    try {
      if (!user) throw "nosession";
      let new_note = new Note({
        noteid: uuidv4(),
        user_email: req.session.userdata.email,
        notebookid: req.body.notebookid,
        title: req.body.notedata.title,
        subtitle: req.body.notedata.subtitle,
        description: req.body.notedata.description,
      });
      // add note
      const saved_note = await new_note.save();
      res.json({ note_added: saved_note ? saved_note : {} });
    } catch (error) {
      console.log(error);
      if (error == "nosession") res.json({ loggedin: false });
      else res.json({ note_added: false });
    }
  })
  .put(async (req, res) => {
    let user = req.session.userdata;
    try {
      if (!user) throw "nosession";
      // edit note title
      const notebook_resp = await Note.updateOne(
        { noteid: req.body.noteid },
        {
          title: req.body.notedata.title,
          subtitle: req.body.notedata.subtitle,
          description: req.body.notedata.description,
        }
      );
      res.json({ updated: notebook_resp.nModified == 1 ? true : false });
    } catch (error) {
      console.log(error);
      if (error == "nosession") res.json({ loggedin: false });
      else res.json({ updated: false });
    }
  })
  .delete(async (req, res) => {
    let user = req.session.userdata;
    try {
      if (!user) throw "nosession";
      // delete note
      const delete_note = await Note.deleteOne({ noteid: req.body.noteid });
      res.json({ deleted: delete_note.n ? true : false });
    } catch (error) {
      console.log(error);
      if (error == "nosession") res.json({ loggedin: false });
      else res.json({ deleted: false });
    }
  });

module.exports = router;
