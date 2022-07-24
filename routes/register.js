const User = require("../models/user");

exports.form = (req, res) => {
  res.render("register", { title: "Register" });
};

exports.submit = (req, res, next) => {
  const data = req.body.user;
  User.getByName(data.name, (err, user) => {
    if (err) return next(err);
    // index can't be 0
    if (user) {
      res.message("User name is existed");
      res.redirect("/register");
    } else {
      user = new User({
        name: data.name,
        pass: data.pass,
      });
      user.save((err) => {
        if (err) return next(err);
        req.session.uid = user.id;
        res.redirect("/");
      });
    }
  });
};
