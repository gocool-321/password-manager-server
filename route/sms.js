const express = require("express");
const router = express();
const client = require("twilio")(
  process.env.ACCOUNT_SID,
  process.env.AUTH_TOKEN
);

router.post("/code", async (req, res) => {
  console.log(req.body);

  const service = process.env.VERIFY_SERVICE_SID;

  client.verify
    .services(service)
    .verifications.create({
      to: req.body.to,
      channel: req.body.channel,
      locale: req.body.locale,
    })
    .then((verification) => {
      console.log(`Sent verification: '${verification.sid}'`);
      res.json({
        success: false,
        respMessage: verification,
      });
    })
    .catch((error) => {
      console.log(error);
      res.json({
        success: false,
        respMessage: error.toString(),
      });
    });
});

router.post("/verify", async (req, res) => {
  console.log(req.body);

  const service = process.env.VERIFY_SERVICE_SID;

  client.verify
    .services(service)
    .verificationChecks.create({
      to: req.body.to,
      code: req.body.code,
    })
    .then((check) => {
      console.log(check);
      if (check.status === "approved") {
        res.json({
          success: true,
          respMessage: check,
        });
      } else {
        res.json({
          success: false,
          respMessage: "Incorrect token.",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.json({
        success: false,
        respMessage: error,
      });
    });
});

module.exports = router;
