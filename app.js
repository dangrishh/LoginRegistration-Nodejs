const express = require("express"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser");

const User = require("./model/User");
const app = express();
const port = process.env.PORT || 3002;
  

// Middleware

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));



  
//=====================
// ROUTES
//=====================
  
// Showing home page
app.get("/", function (req, res) {
    res.render("home");
});
  
// Showing secret page
app.get("/secret", isLoggedIn, function (req, res) {
    res.render("secret");
});
  
// Showing register form
app.get("/register", function (req, res) {
    res.render("register");
});
  
// Handling user signup
app.post("/register", async (req, res) => {
    const user = await User.create({
      username: req.body.username,
      password: req.body.password
    });
    
    return res.status(200).json(user);
  });
  
//Showing login form
app.get("/login", function (req, res) {
    res.render("login");
}); 
  
//Handling user login
app.post("/login", async function(req, res){
    try {
        // check if the user exists 
        const user = await User.findOne({ username: req.body.username });
        if (user) {
          //check if password matches
          const result = req.body.password === user.password;
          if (result) {
            res.render("secret");
          } else {
            res.status(400).json({ error: "password doesn't match" });
          }
        } else {
          res.status(400).json({ error: "User doesn't exist" });
        }
      } catch (error) {
        res.status(400).json({ error });
      }
});
  
//Handling user logout 
app.get("/logout", function (req, res) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
});
  
  
  
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
}
  
/* const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log(`Server Has Started in Lestinning on http://localhost:${port}`);
}); */

mongoose.connect('mongodb+srv://admin:admin@crudnodejs.ydtzqky.mongodb.net/NODE-MONGO?retryWrites=true&w=majority')
.then(() => {
  console.log('MongoDB is Already Connected')

  app.listen(port, function () {
      console.log(`Server Has Started in Lestinning on http://localhost:${port}`);
  });
}).catch((error) => {
  console.log(error)
});