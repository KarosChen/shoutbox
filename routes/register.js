const User = require("../models/user");

exports.form = (req, res) => {
  res.render("register", { title: "Register" });
};

exports.submit = (req, res, next) => {
  const data = req.body.user;
  User.getByName(data.name, (err, user) => {
    if (err) return next(err);
    console.log(user.id);
    // index can't be 0
    if (user.id) {
      console.log(user.id);
      res.message("User name is existed");
      res.redirect("/register");
    } else {
      user = new User({
        user: data.name,
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

// User.getByName("Karos", (err, user) => {
//   console.log(user);
// });
