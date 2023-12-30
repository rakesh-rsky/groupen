const database = require("./database");
const validator = require("validator");

module.exports = {
  signupValidator: function (data) {
    return new Promise(function (resolve, reject) {
      var name = data.name || "";
      var username = data.username || "";
      var password = data.password || "";
      var email = data.email || "";

      var isValidForm = true;
      var infoMessage = "";

      if (validator.isEmpty(name)) {
        isValidForm = false;
        infoMessage = "Please enter name";
        resolve({ isSuccess: isValidForm, message: infoMessage });
      } else if (validator.isEmpty(username)) {
        isValidForm = false;
        infoMessage = "Please enter username";
        resolve({ isSuccess: isValidForm, message: infoMessage });
      } else if (!validator.isLength(username, { min: 3 })) {
        isValidForm = false;
        infoMessage = "Username should minimum 3 character long";
        resolve({ isSuccess: isValidForm, message: infoMessage });
      } else if (validator.isEmpty(password)) {
        isValidForm = false;
        infoMessage = "Please enter password";
        resolve({ isSuccess: isValidForm, message: infoMessage });
      } else if (!validator.isLength(password, { min: 6 })) {
        isValidForm = false;
        infoMessage = "Password should minimum 6 character long";
        resolve({ isSuccess: isValidForm, message: infoMessage });
      } else if (validator.isEmpty(email)) {
        isValidForm = false;
        infoMessage = "Please enter email";
        resolve({ isSuccess: isValidForm, message: infoMessage });
      } else if (!validator.isEmail(email)) {
        isValidForm = false;
        infoMessage = "Please enter valid email";
        resolve({ isSuccess: isValidForm, message: infoMessage });
      } else if (email) {
        database.data_getEmail(email).then(function (result) {
          //console.log(result);
          if (result.length > 0) isValidForm = false;
          infoMessage = "This email is already exists.";
          resolve({ isSuccess: isValidForm, message: infoMessage });
        });

        // }else if(username){
        //   database.data_getUsername(username).then(function(result){
        //     console.log(result);
        //     if(result.length > 0){
        //       isValidForm = false;
        //       infoMessage = 'This Username is already exists.';
        //     }
        //     resolve ({isSuccess : isValidForm, message : infoMessage });
        //   });
      } else {
        resolve({ isSuccess: true, message: "" });
      }
    });
  },

  searchValidator: function (data) {
    return new Promise((resolve, reject) => {
      var text = data.user_search || "";
      isValidForm = true;
      infoMessage = "";

      if (validator.isEmpty(text)) {
        isValidForm = false;
        infoMessage = "This field is required.";
        resolve({ isSuccess: isValidForm, message: infoMessage });
      } else if (!validator.isLength(text, { min: 2 })) {
        isValidForm = false;
        infoMessage = "Please enter at least 2 characters.";
        resolve({ isSuccess: isValidForm, message: infoMessage });
      } else {
        resolve({ isSuccess: true, message: "" });
      }
    });
  },

  newNameValidator: function (data) {
    return new Promise((resolve, reject) => {
      var text = data;
      isValidForm = true;
      infoMessage = "";
      if (validator.isEmpty(text)) {
        isValidForm = false;
        infoMessage = "This field is required.";
        resolve({ isSuccess: isValidForm, message: infoMessage });
      } else if (!validator.isLength(text, { min: 3 })) {
        isValidForm = false;
        infoMessage = "Please enter at least 3 characters";
        resolve({ isSuccess: isValidForm, message: infoMessage });
      } else {
        resolve({ isSuccess: true, message: "" });
      }
    });
  },

  newEmailValidator: function (data) {
    return new Promise((resolve, reject) => {
      var text = data;
      isValidForm = true;
      infoMessage = "";
      if (validator.isEmpty(text)) {
        isValidForm = false;
        infoMessage = "This field is required.";
        resolve({ isSuccess: isValidForm, message: infoMessage });
      } else if (!validator.isEmail(text)) {
        isValidForm = false;
        infoMessage = "Please enter a valid email.";
        resolve({ isSuccess: isValidForm, message: infoMessage });
      } else {
        resolve({ isSuccess: true, message: "" });
      }
    });
  },

  newPasswordValidator: function (data) {
    return new Promise((resolve, reject) => {
      var text = data;
      isValidForm = true;
      infoMessage = "";
      if (validator.isEmpty(text)) {
        isValidForm = false;
        infoMessage = "This field is required.";
        resolve({ isSuccess: isValidForm, message: infoMessage });
      } else if (!validator.isLength(text, { min: 6 })) {
        isValidForm = false;
        infoMessage = "Password should minimum 6 character long";
        resolve({ isSuccess: isValidForm, message: infoMessage });
      } else {
        resolve({ isSuccess: true, message: "" });
      }
    });
  },
};
