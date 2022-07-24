const Entry = require("../models/entry");

exports.form = (req, res) => {
  res.render("post", { title: "Post" });
};

exports.submit = (req, res) => {
  const user = res.locals.user;
  const username = user ? user.name : null;
  const entry = new Entry({
    username: username,
    title: data.title,
    body: data.body,
  });
  entry.save((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
};

exports.list = (req, res) => {
  Entry.getAll((err, entries) => {
    res.render("entries", {
      title: "Entries",
      entries: entries,
    });
  });
};
