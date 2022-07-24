const User = require("../models/user");
exports.form = (req, res) => {
  res.render("login", { title: "Login" });
};

exports.submit = (req, res, next) => {
  const data = req.body.user;
  User.authenticate(data.name, data.pass, (err, user) => {
    if (err) return next(err);
    if (user) {
      req.session.id = user.id;
      res.redirect("/");
    } else {
      res.message("Sorry! Invalid");
      res.redirect("/login");
    }
  });
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect("/");
  });
};