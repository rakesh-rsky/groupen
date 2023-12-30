$(document).on("submit", "#login-form", function (e) {
  e.preventDefault();
  $(".login-info").css({ display: "none" });

  $.ajax({
    type: $(this).attr("method"),
    url: $(this).attr("action"),
    contentType: false,
    processData: false,
    data: new FormData($("#login-form")[0]),

    success: function (data) {
      $(".login-btn").removeAttr("disabled");
      $(".login-btn").text("Login");
      if (data.isSuccess) {
        userDataDisplay(data);
      } else {
        $(".login-info").text(data.message);
        $(".login-info").css({ display: "block" });
      }
    },

    err: function (req, err) {},

    beforeSend: function () {
      $(".login-btn").attr("disabled", "disabled");
      $(".login-btn").text("please wait..");
    },
  });
});

$(document).on("focus", ".username, .password", function (e) {
  $(".login-info").css({ display: "none" });
});

//*****************contact form**********************/

$(document).on("submit", "#contactform", function (e) {
  e.preventDefault();
  $.ajax({
    type: $(this).attr("method"),
    url: $(this).attr("action"),
    contentType: false,
    processData: false,
    data: new FormData($("#contactform")[0]),
    success: function (data) {
      $("#contact-btn").removeAttr("disabled");
      $("#contact-btn").text("Submit");
      if (data.success) {
        $("#con_fullname").val("");
        $("#con_email").val("");
        $("#con_message").val("");
        $(".contact-info").addClass("alert alert-success");
        $(".contact-info").text(data.msg);
        $(".contact-info").css({ margin: "10px" });

        setTimeout(function () {
          $(".contact-info").removeClass("alert alert-success");
          $(".contact-info").text("");
          $(".contact-info").css({ margin: "0px" });
        }, 10000);
      } else {
        alert("err.." + data.msg);
      }
    },
    err: function (req, err) {
      $("#contact-btn").removeAttr("disabled");
      $("#contact-btn").text("Submit");
      alert(err + " with status code " + req.statusText);
    },
    beforeSend: function () {
      $("#contact-btn").attr("disabled");
      $("#contact-btn").text("Please wait...");
    },
  });
});

//*****************signup form**********************/

$(document).on("submit", "#signup-form", function (e) {
  e.preventDefault();
  $.ajax({
    type: $(this).attr("method"),
    url: $(this).attr("action"),
    contentType: false,
    processData: false,
    data: new FormData($("#signup-form")[0]),
    success: function (data) {
      $(".signup-btn").removeAttr("disabled");
      $(".signup-btn").text("sign up");

      if (data.success) {
        $("#signup-modal").modal("hide");

        localStorage.setItem("tk", data.message);
        window.location.href = "/emailVerification";
      } else {
        alert(data.message);
      }
    },

    err: function (req, err) {
      $(".signup-btn").removeAttr("disabled");
      $(".signup-btn").text("sign up");
      alert(err + "with status code" + req.statusText);
    },

    beforeSend: function () {
      $(".signup-btn").attr("disabled", "disabled");
      $(".signup-btn").text("Please wait...");
    },
  });
});

//*****************username check form**********************/
$(document).on("blur", "#username", function (e) {
  var username = $(this).val();

  $.ajax({
    type: "post",
    url: "/username/check",
    data: {
      username: username,
    },
    success: function (data) {
      if (data.isValid) {
        $(".username-info").text(data.message);
        $(".username-info").css({ display: "block", color: "#0f0" });
      } else {
        $(".username-info").text(data.message);
        $(".username-info").css({ display: "block", color: "#f00" });
      }
    },

    err: function (req, err) {
      alert(err + "with status code" + req.statusText);
    },

    beforeSend: function () {},
  });
});

//*****************send request form**********************/

$(document).on("click", ".send-request-btn", function (e) {
  e.preventDefault();
  // var to = $('.send-request-btn').siblings('.user').text();
  // var to = $(this).attr('data-username');
  var to = $(this).data("username");
  var from = $(".user-name").text();
  // to = to.substring(0,to.length/2);
  var btn = $(this);
  var requestData = {
    to: to,
    fromUsername: from,
    fromName: nameGlobalFunction,
  };
  $.ajax({
    type: "POST",
    url: "/user/send_request",
    data: requestData,
    success: function (data) {
      $(btn).removeAttr("disabled");
      $(btn).text("send for chat");

      if (data.success) {
        $(btn).attr("disabled", "disabled");
        $(btn).text("request sent");
        $(btn).css({ "background-color": "#ccc", color: "#874" });
      } else {
        alert(data.message);
      }
    },

    err: function (req, err) {},

    beforeSend: function () {
      $(btn).attr("disabled", "disabled");
      $(btn).text("please wait..");
    },
  });
});

$(document).on("submit", "#search-user-form", function (e) {
  e.preventDefault();
  $(".search-list").remove();
  $(".search-info").css({ display: "none" });

  $.ajax({
    type: $(this).attr("method"),
    url: $(this).attr("action"),
    contentType: false,
    processData: false,
    data: new FormData($("#search-user-form")[0]),

    success: function (data) {
      $("#user-search-btn").removeAttr("disabled");
      $("#user-search-btn").text("search");
      if (data.isSuccess) {
        usernameDisplay(data.message);
      } else {
        if (data.message == undefined) {
          window.location.href = "/";
        } else {
          $(".search-info").text(data.message);
          $(".search-info").css({ display: "block" });
          // alert(data.message);
        }
      }
    },

    err: function (req, err) {},

    beforeSend: function () {
      $("#user-search-btn").attr("disabled", "disabled");
      $("#user-search-btn").text("please wait..");
    },
  });
});

$(document).on("click", "#chat-request", function (e) {
  e.preventDefault();
  $(".request-list").remove();

  $.ajax({
    type: "POST",
    url: "/user/get_request",
    data: {
      username: $(".user-name").text(),
    },
    success: function (data) {
      requestListDisplay(data);
    },
  });
});

$(document).on("click", ".request-accept-btn", function (e) {
  e.preventDefault();
  var requester = $(this).attr("data-username");
  // var requester = $(this).siblings('.users').text();
  var accepter = $(".user-name").text();
  // requester = requester.substring(0,requester.length/2);
  var btn = $(this);
  var acceptData = {
    requester: requester,
    accepter: accepter,
  };
  $.ajax({
    type: "POST",
    url: "/user/accept_request",
    data: acceptData,
    success: function (data) {
      $(btn).removeAttr("disabled");
      $(btn).text("Accept");

      if (data.success) {
        $(btn).attr("disabled", "disabled");
        $(btn).text("Friend");
        $(btn).css({ "background-color": "#ccc", color: "#874" });
        $(btn).siblings(".request-delete-btn").css({ display: "none" });

        usernameDisplayInOnlineTab(accepter, requester);
      } else {
        alert(data.message);
      }
    },

    err: function (err, req) {},

    beforeSend: function () {},
  });
});

$(document).on("click", ".request-delete-btn", function (e) {
  e.preventDefault();
  var requester = $(this).attr("data-username");
  // var requester = $(this).siblings('.users').text();
  var accepter = $(".user-name").text();
  // requester = requester.substring(0,requester.length/2);
  var btn = $(this);
  var deleteData = {
    requester: requester,
    accepter: accepter,
  };
  $.ajax({
    type: "POST",
    url: "/user/delete_request",
    data: deleteData,
    success: function (data) {
      $(btn).removeAttr("disabled");
      $(btn).text("Delete");

      if (data.success) {
        $(btn).attr("disabled", "disabled");
        $(btn).text("Deleted");
        $(btn).css({ "background-color": "#ccc", color: "#874" });
        $(btn).siblings(".request-accept-btn").css({ display: "none" });
      } else {
        alert(data.message);
      }
    },

    err: function (err, req) {},

    beforeSend: function () {},
  });
});

$(document).on("click", "#name-change-btn", function (e) {
  e.preventDefault();
  $.ajax({
    type: "post",
    url: "/user/change-name",
    // contentType:false,
    // processData:false,
    data: {
      newname: $("#new-name").val(),
    },
    success: function (data) {
      $("#name-change-btn").removeAttr("disabled");
      $("#name-change-btn").text("Save");
      if (data.isSuccess) {
        $(".newname-info").removeClass("alert-danger");
        $(".newname-info").addClass("alert-success");
      } else {
        $(".newname-info").removeClass("alert-success");
        $(".newname-info").addClass("alert-danger");
      }
      $(".newname-info").text(data.message);
      $(".newname-info").css({ display: "block" });
    },

    err: function (req, err) {},

    beforeSend: function () {
      $("#name-change-btn").attr("disabled", "disabled");
      $("#name-change-btn").text("please wait..");
    },
  });
});

$(document).on("click", "#email-change-btn", function (e) {
  e.preventDefault();
  $.ajax({
    type: "post",
    url: "/user/change-email",
    // contentType:false,
    // processData:false,
    data: {
      newemail: $("#new-email").val(),
    },
    success: function (data) {
      $("#email-change-btn").removeAttr("disabled");
      $("#email-change-btn").text("Save");
      if (data.isSuccess) {
        $(".newemail-info").removeClass("alert-danger");
        $(".newemail-info").addClass("alert-success");
      } else {
        $(".newemail-info").removeClass("alert-success");
        $(".newemail-info").addClass("alert-danger");
      }
      $(".newemail-info").text(data.message);
      $(".newemail-info").css({ display: "block" });
    },

    err: function (req, err) {},

    beforeSend: function () {
      $("#email-change-btn").attr("disabled", "disabled");
      $("#email-change-btn").text("please wait..");
    },
  });
});

$(document).on("click", "#password-change-btn", function (e) {
  e.preventDefault();
  $.ajax({
    type: "post",
    url: "/user/change-password",
    // contentType:false,
    // processData:false,
    data: {
      oldpassword: $("#old-password").val(),
      newpassword: $("#new-password").val(),
    },
    success: function (data) {
      $("#password-change-btn").removeAttr("disabled");
      $("#password-change-btn").text("change");
      if (data.isSuccess) {
        $(".newpassword-info").removeClass("alert-danger");
        $(".newpassword-info").addClass("alert-success");
      } else {
        $(".newpassword-info").removeClass("alert-success");
        $(".newpassword-info").addClass("alert-danger");
      }
      $(".newpassword-info").text(data.message);
      $(".newpassword-info").css({ display: "block" });
    },

    err: function (req, err) {},

    beforeSend: function () {
      $("#password-change-btn").attr("disabled", "disabled");
      $("#password-change-btn").text("please wait..");
    },
  });
});
