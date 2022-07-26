var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var entries = require("./routes/entries");
var register = require("./routes/register");
var login = require("./routes/login");
var validate = require("./middlewares/validate");
var messages = require("./middlewares/messages");
var user = require("./middlewares/user");
var api = require("./routes/api");
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));
app.user("/api", api.auth);
app.use(user);

app.use(messages);

app.use("/users", usersRouter);
app.get("/", entries.list);
app.get("/post", entries.form);
app.post(
  "/post",
  validate.required("entry[title]"),
  validate.lengthAbove("entry[title]", 4),
  entries.submit
);
app.get("/register", register.form);
app.post("/register", register.submit);
app.get("/login", login.form);
app.post("/login", login.submit);
app.get("/logout", login.logout);

app.get("/api/user/:id", api.user);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
