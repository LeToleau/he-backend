var express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
var md5 = require('md5');

const User = require("../models/loginModel");

router.post("/public-login", async (req, res) => {
  const { email, password } = req.body;

});

module.exports = router;