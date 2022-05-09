const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

// set PORT
app.set("port", process.env.PORT || 8080);
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

mongoose
  .connect("mongodb+srv://gokul:m5LEFgsbdjfDCFoR@cluster0.pofuc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Mongodb connected successfully"))
  .catch((err) => {
    console.log(err);
    console.log("Mongdb connection faild");
  });

app.use(cookieParser());
var MemoryStore = session.MemoryStore;
app.use(
  session({
    name: "app.sid",
    secret: "pass-manager",
    resave: false,
    store: new MemoryStore(),
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  })
);

app.use("/auth", require("./route/auth"));
app.use("/pass", require("./route/creds"));
app.use("/notes", require("./route/notebook"));
app.use("/docs", require("./route/docs"));
// app.use("/send", require("./route/sms"));

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
  app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(app.get("port"), () => {
  console.log(`Listening on PORT: ${app.get("port")}`);
});
