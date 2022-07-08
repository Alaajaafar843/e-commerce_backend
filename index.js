const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotnev = require("dotenv");
const bodyParser = require("body-parser");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const session = require("express-session");
const passport = require("passport");
const User = require("./models/User");
const cors = require("cors");
//const stripe = require("./routes/stripe");

dotnev.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("====================================");
    console.log("Database connected");
    console.log("====================================");
  })
  .catch((err) => {
    console.log("====================================");
    console.log(err);
    console.log("====================================");
  });
app.use(session({ secret: "melody hensley is my spirit animal" }));
app.use(cors);
app.use(bodyParser.json());
const GoogleStrategy = require("passport-google-oauth20").Strategy;

//Middleware
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize()); // init passport on every route call
app.use(passport.session()); //allow passport to use "express-session"

//Get the GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET from Google Developer Console

authUser = async (request, accessToken, refreshToken, profile, done) => {
  return done(null, { accessToken, profile });
};

//Use "GoogleStrategy" as the Authentication Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
      passReqToCallback: true,
    },
    authUser
  )
);

passport.serializeUser((user, done) => {
  console.log(`\n--------> Serialize User:`);
  console.log(user);
  // The USER object is the "authenticated user" from the done() in authUser function.
  // serializeUser() will attach this user to "req.session.passport.user.{user}", so that it is tied to the session object for each session.

  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log("\n--------- Deserialized User:");
  console.log(user);
  // This is the {user} that was saved in req.session.passport.user.{user} in the serializationUser()
  // deserializeUser will attach this {user} to the "req.user.{user}", so that it can be used anywhere in the App.

  done(null, user);
});

app.use("/api/users/", userRoute);
app.use("/api/auth/", authRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
//app.use("/api/checkout", stripe);

app.listen(process.env.PORT || 5000, () => {
  console.log("====================================");
  console.log("Backend server is running");
  console.log("====================================");
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    res.status(200).json({
      token: req.user.accessToken,
      profile: req.user.profile._json,
    });
  }
);
