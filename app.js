require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();
mongoose.connect("mongodb://localhost:27017/userDB");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const userSchema = mongoose.Schema({
  email: String,
  password: String,
});

const secret = process.env.SECRET;
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  try {
    const user = new User({
      email: req.body.username,
      password: req.body.password,
    });
    await user.save();
    res.render("secrets");
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.username;
    const password = req.body.password;
    const user = await User.findOne({ email: email });
    console.log(user);
    if (user && user.password === password) {
      res.render("secrets");
    } else {
      res.redirect("/");
    }
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

app.listen(3000, (req, res) => {
  console.log("App running on 3000");
});
