const auth = require("basic-auth");
const User = require("../models/user");
const Entry = require("../models/entry");

exports.auth = (req, res, next) => {
  const { name, pass } = auth(req);
  User.authenticate(name, pass, (err, user) => {
    if (user) req.remoteUser = user;
    next(err);
  });
};

exports.user = (req, res, next) => {
  User.get(Number(req.params.id), (err, user) => {
    if (err) return next(err);
    if (!user) return res.status(404);
    res.send(JSON.stringify(user.toJSON()));
  });
};

exports.entries = (req, res, next) => {
  Entry.getAll((err, entries) => {
    if (err) return next(err);
    res.format({
      "application/json": () => {
        res.send(JSON.stringify(entries));
      },
      "application/xml": () => {
        res.render("entries/xml", { entries: entries });
      },
    });
  });
};
