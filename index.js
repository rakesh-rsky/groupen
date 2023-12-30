var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
const hbs = require("hbs");
const routing = require("./routing");
const express = require("express");
const conSocket = require("./models/con_socket");
const auth = require("./models/authentication");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bcrypt = require("bcryptjs");

var PORT_NUMBER = process.env.PORT || 3019;

app.set("view engine", "hbs");
app.set("view options", {
  layout: "layouts/layout.hbs",
});

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());

app.use(cookieParser());
app.use(express.static(__dirname + "/public"));

app.use(
  session({
    name: "ran",
    secret: "kgerhgkdn65rtgkkhgkerj8ghsiurh2gaekrgbh",
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      autoremove: "disabled",
    }),
    cookie: {},
  })
);

//*****prevent https redirect loop****
app.enable("trust proxy");

var isLogin = false;
// var sessionUsername = "";
// var sessionPassword = "";
app.use((req, res, next) => {
  //**************redirect to https*****
  if (req.protocol != "https") {
    //res.redirect("https://" + req.headers.host + req.url);
  }
  //************************************

  isLogin =
    req.session.authenticated == undefined || req.session.authenticated == null
      ? false
      : req.session.authenticated;
  sessionUsername =
    req.session.username == undefined || req.session.username == null
      ? ""
      : req.session.username;
  sessionPassword =
    req.session.password == undefined || req.session.password == null
      ? ""
      : req.session.password;

  // console.log(isLogin);
  // maintenance page
  next();
});

conSocket.custom_socket(io);

hbs.registerPartials(__dirname + "/views/partials");

hbs.registerHelper("loggedUsername", function () {
  if (sessionUsername != "") {
    return bcrypt.hashSync(sessionUsername, 8);
  } else {
    return "";
  }
});

hbs.registerHelper("loggedPassword", function () {
  if (sessionPassword != "") {
    return bcrypt.hashSync(sessionPassword, 8);
  } else {
    return "";
  }
});

app.use("/user", [auth.notAllowAnonymous], routing);
app.use("/", routing);

http.listen(PORT_NUMBER, function () {
  console.log("listening on port:" + PORT_NUMBER);
});
