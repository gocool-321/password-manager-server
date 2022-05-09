const express = require("express");
const router = express();
const { v4: uuidv4 } = require("uuid");

const Doc = require("../model/Docs");
const User = require("../model/User");

router.route("/list").get(async (req, res) => {
  const docsList = await Doc.find({
    docTitle: "mongodb",
  });
  res.json(docsList.length > 0 ? docsList : []);
});

router.route("/add").post(async (req, res) => {
  if (req.session.userdata) {
    const newDoc = new Doc({
      docid: uuidv4(),
      email: req.session.userdata.email,
      docTitle: "mongodb",
      query: req.body.query,
      hashtags: req.body.hashtags,
      definition: req.body.definition,
    });
    let newDocResp = await newDoc.save();
    if (!newDocResp)
      res.json({
        added: false,
        respMessage: "Unable to Save",
      });
    else {
      res.json({
        added: true,
        docData: newDocResp,
        respMessage: "Saved Successfully",
      });
    }
  } else {
    res.json({
      added: false,
      respMessage: "Kindly, login to add new Doc",
    });
  }
});

router.route("/delete").put(async (req, res) => {
  if (req.session.userdata) {
    const deleteResp = await Doc.deleteOne({
      docid: req.body.docid,
    });
    res.json({
      deleted: deleteResp.deletedCount == 1 ? true : false,
      respMessage:
        deleteResp.deletedCount == 1 ? "Deleted Successfully" : "Doc not found",
    });
  } else {
    res.json({
      deleted: false,
      respMessage: "Kindly, login to delete Doc",
    });
  }
});

module.exports = router;
