const express = require("express");
const home = require("./controller/home");
const multer = require("multer");
const sync = require("sync");
var router = express.Router();
var update = multer();

router.get("/", home.index);

router.get("/about-us", home.about);

router.get("/emailVerification", home.emailVerification);

router.post("/contactform", [update.any()], home.index_contact);

router.post("/signup", [update.any()], home.index_signupPost);

router.post("/username/check", home.index_usernameCheck);

router.post("/login", [update.any()], home.index_loginPost);

router.post("/verifyotp", [update.any()], home.otpVerification);

router.post("/user/search", [update.any()], home.index_searchUserPost);

router.post("/user/send_request", home.index_sendRequestPost);

router.post("/user/get_request", home.index_getRequestList);

router.post("/user/accept_request", home.index_acceptRequest);

router.post("/user/delete_request", home.index_deleteRequest);

router.post("/user/change-name", home.index_changeName);

router.post("/user/change-email", home.index_changeEmail);

router.post("/user/change-password", home.index_changePassword);

router.get("/user/logout", home.logout);

module.exports = router;
