const express = require("express");
const router = express();
const { v4: uuidv4 } = require("uuid");

const User = require("../model/User");

router
  .route("/login")
  .get(async (req, res) => {
    res.json({
      loggedin: req.session.userdata ? true : false,
      userdata: req.session.userdata ? req.session.userdata : null,
    });
  })
  .post(async (req, res) => {
    try {
      const cred = await User.findByCredentials(
        req.body.email,
        req.body.password
      );
      if (!cred) throw "Invalid Credentials";
      else {
        req.session.userdata = {
          userid: cred.userid,
          name: cred.name,
          email: cred.email,
          pin: cred.pin,
        };
        res.json({ loggedin: true });
      }
    } catch (error) {
      console.log(error);
      res.json({ loggedin: false });
    }
  });

router.route("/signup").post(async (req, res) => {
  try {
    const userId = uuidv4();
    var newUser = new User({
      userid: userId,
      name: req.body.fullname,
      email: req.body.email,
      password: req.body.password,
      pin: req.body.pin,
    });
    const newuser = await newUser.save();
    if (!newuser) throw "Error creating account";
    else {
      req.session.userdata = {
        userid: newuser.userid,
        name: newuser.name,
        email: newuser.email,
        pin: newuser.pin,
      };
      res.json({ created: true });
    }
  } catch (error) {
    console.log(error);
    res.json({ created: false });
  }
});

router.route("/logout").get(async (req, res) => {
  if (req.session.userdata) {
    req.session.destroy(() => {
      res.json({ loggedout: true });
    });
  } else {
    res.json({ loggedout: false });
  }
});

module.exports = router;
