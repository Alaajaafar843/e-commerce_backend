const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotnev = require("dotenv");
const bodyParser = require("body-parser");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
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

app.use(bodyParser.json());

app.use("/api/users/", userRoute);
app.use("/api/auth/", authRoute);
app.use("/api/products", productRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log("====================================");
  console.log("Backend server is running");
  console.log("====================================");
});
