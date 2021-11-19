const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
app.use(cookieParser());
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
   if(!token) return res.redirect("/login");
  try {
    const decoded = jwt.verify(token, process.env.TOKEN);
    req.user = decoded;
    console.log("req.user:", req.user);
    return next();
  } catch (err) {
    return res.status(401).send("Invalid Token"+ err);
  }
};

module.exports = verifyToken;