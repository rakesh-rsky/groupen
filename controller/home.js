const server_validator = require("../models/server_validation");
const multer = require("multer");
const database = require("../models/database");
const sg = require("../models/mail");
const bcrypt = require("bcryptjs");

var roomListServer;
module.exports = {
  index: function (req, res) {
    res.render("../views/home/index.hbs");
  },
  about: function (req, res) {
    res.render("../views/home/about.hbs");
  },

  emailVerification: function (req, res) {
    res.render("../views/home/emailVerification.hbs", {
      layout: "../views/layouts/layout.hbs",
    });
  },

  logout: function (req, res) {
    req.session.authenticated = false;
    req.session.name = "";
    req.session.username = "";
    req.session.password = "";
    req.session.destroy();
    res.redirect("/");
    //session destroy.....here
  },

  index_loginPost: function (req, res) {
    var user = req.body.username || "";
    var pass = req.body.password || "";

    sessionUsername =
      req.session.username == undefined || req.session.username == null
        ? ""
        : req.session.username;
    sessionPassword =
      req.session.password == undefined || req.session.password == null
        ? ""
        : req.session.password;
    var userUsername = bcrypt.compareSync(sessionUsername, user)
      ? sessionUsername
      : user;
    var userPassword = bcrypt.compareSync(sessionPassword, pass)
      ? sessionPassword
      : pass;

    var data = {
      username: userUsername,
      password: userPassword,
    };
    var isSuccess;
    var message;
    // var resultData ;
    // var roomDetail;

    database.data_loginVerify(data).then(function (resultData) {
      console.log(resultData);
      database.data_oldMessage(data).then(function (oldMessage) {
        if (resultData.length > 0) {
          isSuccess = true;

          req.session.authenticated = true;
          req.session.name = resultData[0].name;
          req.session.username = resultData[0].username;
          req.session.password = resultData[0].password;

          delete resultData[0].password;

          message = {
            resultData: resultData,
            oldMessage: oldMessage,
          };
          roomListServer = resultData;
        } else {
          isSuccess = false;
          message = "Login Failed : username or password is incorrect.";
        }
        // ////console.log("ending...");
        req.session.save(function () {
          res.send({
            isSuccess: isSuccess,
            message: message,
          });
        });

        // });
      });
    });
  },

  index_signupPost: function (req, res) {
    database.data_getUsername(req.body.username).then((result) => {
      if (result.length > 0) {
        res.send({
          success: false,
          message: `"${req.body.username}" username is  already exists.`,
        });
      } else {
        server_validator
          .signupValidator(req.body)
          .then(function (form_validation) {
            var isSuccess = form_validation.isSuccess;
            var message = form_validation.message;

            if (isSuccess) {
              var code = Math.random().toString().split(".")[1].substr(0, 6);
              req.body["otp"] = code;
              sg.sgVerification(req.body.name, req.body.email, code)
                .then(() => {
                  database.data_signUp("unverified", req.body);

                  res.send({
                    success: isSuccess,
                    message: req.body.email,
                  });
                })
                .catch((error) => {
                  ////console.log(error);
                });
            } else {
              res.send({
                success: isSuccess,
                message: message,
              });
            }
          });
      }
    });
  },

  index_usernameCheck: function (req, res) {
    // var isValid = true ;
    // var message ="";
    var username = req.body.username;
    ////console.log(username);
    database.data_getUsername(username).then((result) => {
      if (result.length > 0) {
        isValid = false;
        message = `"${username}" username is already exists.`;
      } else {
        isValid = true;
        message = `"${username}" username is available.`;
      }

      res.send({
        isValid: isValid,
        message: message,
      });
    });
  },

  otpVerification: function (req, res) {
    var data = {
      otp: req.body.otp,
      email: req.body.tk,
    };
    //console.log(data);
    database.data_unverified(data).then(function (result) {
      //console.log(result);
      if (result.length > 0) {
        var freshData = {
          name: result[0].name.toLowerCase() || "",
          username: result[0].username.toLowerCase() || "",
          email: result[0].email.toLowerCase() || "",
          password: result[0].password || "",
          otp: result[0].otp.toLowerCase() || "",
        };

        database.data_signUp("verified", freshData);
        res.send({
          success: true,
          message: "otp verified",
        });
      } else {
        res.send({
          success: false,
          message: "Incorrect otp..",
        });
      }
    });
  },

  index_searchUserPost: function (req, res) {
    var data = req.body;
    var isSuccess;
    var message;

    server_validator.searchValidator(req.body).then((form_validation) => {
      var isValid = form_validation.isSuccess;
      var info = form_validation.message;

      if (isValid) {
        database.data_allUserList(req.body).then(function (result1) {
          if (result1.length > 0) {
            //console.log(result1);

            isSuccess = true;
            message = {
              resultData1: result1,
            };
          } else {
            isSuccess = false;
            message = "no user found ..";
          }
          // //console.log("ending...");
          res.send({
            isSuccess: isSuccess,
            message: message,
          });
        });
      } else {
        res.send({
          isSuccess: isValid,
          message: info,
        });
      }
    });
  },

  index_sendRequestPost: function (req, res) {
    var data = req.body;
    var isSuccess = true;
    var message;
    //console.log('------------------');
    //console.log(req.body);
    //console.log(data);
    database.data_sendRequest(req.body).then(function (result) {
      // //console.log(result);
      if (isSuccess) {
        res.send({
          success: isSuccess,
          message: "request sent",
        });
      } else {
        res.send({
          success: isSuccess,
          message: "Error in sending request.",
        });
      }
    });
  },

  index_getRequestList: function (req, res) {
    // var data = req.body;
    var isSuccess = true;
    var message;
    //console.log(req.body);
    database.data_getRequest(req.body).then(function (result) {
      //console.log(result[0].request);
      // if(isSuccess){
      res.send({
        success: isSuccess,
        message: result[0].request,
      });
      //
      // }else{
      //   res.send({
      //     success:isSuccess,
      //     message:"Error in getting request."
      //   });
      // }
    });
  },

  index_acceptRequest: function (req, res) {
    var data = req.body;

    data["roomid"] = data.accepter + "@" + data.requester;

    var isSuccess = true;
    var message;
    // //console.log(req.body);
    //console.log(data);
    database.data_acceptRequest(data);

    if (isSuccess) {
      res.send({
        success: isSuccess,
        message: "request accepted",
      });
    } else {
      res.send({
        success: isSuccess,
        message: "Error in accepting request.",
      });
    }
  },

  index_deleteRequest: function (req, res) {
    var data = req.body;

    var isSuccess = true;
    var message;
    // //console.log(req.body);
    //console.log(data);
    database.data_deleteRequest(data);

    if (isSuccess) {
      res.send({
        success: isSuccess,
        message: "request deleted",
      });
    } else {
      res.send({
        success: isSuccess,
        message: "Error in deleting request.",
      });
    }
  },

  index_contact: function (req, res) {
    //console.log(req.body);

    var contactData = {
      fullname: req.body.fullname || "",
      email: req.body.email || "",
      message: req.body.message || "",
    };

    database.data_contact(contactData).then(function (result) {
      res.send({
        success: true,
        msg: "Your message received, we will reach you shortly..",
      });
    });
  },

  index_changeName: function (req, res) {
    var data = {
      username: req.session.username,
      password: req.session.password,
      newname: req.body.newname,
    };

    server_validator.newNameValidator(req.body.newname).then((formInfo) => {
      var isValid = formInfo.isSuccess;
      var msg = formInfo.message;
      if (isValid) {
        database.data_newName(data).then((result) => {
          //console.log(result);
          if (result.matchedCount == 1 && result.modifiedCount == 1) {
            res.send({
              isSuccess: true,
              message: "name updated.",
            });
          } else {
            res.send({
              isSuccess: false,
              message: "unable to update your name.",
            });
          }
        });
      } else {
        res.send({
          isSuccess: isValid,
          message: msg,
        });
      }
    });
  },
  index_changeEmail: function (req, res) {
    var data = {
      username: req.session.username,
      password: req.session.password,
      newemail: req.body.newemail,
    };

    server_validator.newEmailValidator(req.body.newemail).then((formInfo) => {
      var isValid = formInfo.isSuccess;
      var msg = formInfo.message;
      if (isValid) {
        database.data_newEmail(data).then((result) => {
          //console.log(result);
          if (result.matchedCount == 1 && result.modifiedCount == 1) {
            res.send({
              isSuccess: true,
              message: "email updated.",
            });
          } else {
            res.send({
              isSuccess: false,
              message: "unable to update your email.",
            });
          }
        });
      } else {
        res.send({
          isSuccess: isValid,
          message: msg,
        });
      }
    });
  },

  index_changePassword: function (req, res) {
    var data = {
      username: req.session.username,
      password: req.body.oldpassword,
      newpassword: req.body.newpassword,
    };

    server_validator
      .newPasswordValidator(req.body.newpassword)
      .then((formInfo) => {
        var isValid = formInfo.isSuccess;
        var msg = formInfo.message;
        if (isValid) {
          database.data_newPassword(data).then((result) => {
            ////console.log(result);
            if (result.matchedCount == 1 && result.modifiedCount == 1) {
              req.session.password = req.body.newpassword;
              res.send({
                isSuccess: true,
                message: "password changed.",
              });
            } else {
              res.send({
                isSuccess: false,
                message: "incorrect password.",
              });
            }
          });
        } else {
          res.send({
            isSuccess: isValid,
            message: msg,
          });
        }
      });
  },
  roomListData: function () {
    //calling these function in con_socket.js to auto join room.
    var roomList;
    roomList = roomListServer;
    roomList = roomList[0].room;
    roomList = roomList.map((room) => room.roomid);
    return roomList;
  },
};
