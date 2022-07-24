const express = require("express");
const { MongoMissingCredentialsError } = require("mongodb");

function message(req) {
  return (msg, type) => {
    type = type || "info";
    let sess = req.session;
    sess.messages = sess.messages || [];
    sess.messages.push({ type: type, string: msg });
  };
}

module.exports = (req, res, next) => {
  res.message = message(req);
  res.locals.messages = req.session.messages || [];
  res.locals.removeMessages = () => {
    req.session.messages = [];
  };
  next();
};
