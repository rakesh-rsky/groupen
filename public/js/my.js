$(document).ready(function () {
  $("#login-modal").modal("show");

  $(".search-info").css({ display: "none" });

  function scrolling() {
    $("body, html").animate({
      scrollTop: $(document).height(),
    });
  }

  $(function () {
    $("#video-call-btn").css({
      display: "none",
    });
  });

  $(document).on("focus", "#m, #m2, #btn", function () {
    $(this).css({
      outline: "none",
    });
  });

  $(document).on("click", "#btn", function () {
    $("#m").focus();
  });

  // $(document).on('click','#online-show-btn', function(){
  //   if($('div#navbar').hasClass('cus-collapse')){
  //     $('div#navbar').css({
  //       'width':'50%'
  //     });
  //     $('div#navbar').removeClass('cus-collapse');
  //
  //   }else{
  //     $('div#navbar').css({
  //       'width':'0px'
  //     });
  //     $('div#navbar').addClass('cus-collapse');
  //   }
  // });
  $(document).on("click", "#toggle-close-btn1", function () {
    $("div#navbar").css({
      width: "0px",
    });
    setTimeout(function () {
      if ($("div#navbar").hasClass("in")) {
        $("div#navbar").removeClass("in");
      }
    }, 700);
  });

  $(document).on("click", "#toggle-close-btn2", function () {
    $("#user-panel").css({
      width: "0px",
    });
    setTimeout(function () {
      if ($("#user-panel").hasClass("in")) {
        $("#user-panel").removeClass("in");
      }
    }, 700);
  });

  $(document).on("click", "#online-show-btn", function () {
    $("div#navbar").css({
      width: "50%",
    });
  });

  $(document).on("click", ".user-panel", function () {
    $("#user-panel").css({
      width: "50%",
    });
  });

  $(".userlist-name").nanoScroller();

  $(document).on("click", ".signup-to-login", function () {
    $("#signup-modal").modal("hide");
    $("#login-modal").modal("show");
  });

  $(document).on("click", ".login-to-signup", function () {
    $("#login-modal").modal("hide");
    $("#signup-modal").modal("show");
  });

  $(document).on("focus", "#m", function () {
    if ($("#navbar").hasClass("in")) {
      $("#navbar").removeClass("in");
    }
    if ($("#user-panel").hasClass("in")) {
      $("#user-panel").removeClass("in");
    }
  });

  $(document).on("click", "li.username", function () {
    if ($("#navbar").hasClass("in")) {
      $("#navbar").removeClass("in");
    }
    if ($("#user-panel").hasClass("in")) {
      $("#user-panel").removeClass("in");
    }
  });

  $(document).on("click", ".location", function () {
    if ($("#navbar").hasClass("in"));
    {
      $("#navbar").removeClass("in");
    }
    if ($("#user-panel").hasClass("in")) {
      $("#user-panel").removeClass("in");
    }
  });

  $(document).on("click", "li.username a", function () {
    $("li.username").css({
      "background-color": "#3aaa9e",
    });
    $(this).parent().css({
      "background-color": "#9e374a",
    });
  });

  $(document).on("click", ".search-user-close-btn", function () {
    $("#search-modal").modal("hide");
  });

  $(document).on("click", ".chat-request-close-btn", function () {
    $("#chat-request-modal").modal("hide");
  });

  $(document).on("click", ".friend-list-close-btn", function () {
    $("#friend-list-modal").modal("hide");
  });

  $(document).on("click", ".setting-close-btn", function () {
    $("#setting-modal").modal("hide");
  });

  $(document).on("click", "#user-search-btn", function () {
    $(".search-list").remove();
  });
  $(document).on("click", ".user-panel", function () {});

  $(document).on("click", "#search", function () {
    $("#search-modal").modal("show");
    $(".search-list").remove();
  });

  $(document).on("click", "#chat-request", function () {
    $("#chat-request-modal").modal("show");
  });

  $(document).on("click", "#friend-list", function () {
    $("#friend-list-modal").modal("show");
  });

  $(document).on("click", "#setting", function () {
    $("#setting-modal").modal("show");
    $("#name-change").addClass("hiding");
    $("#email-change").addClass("hiding");
    $("#password-change").addClass("hiding");
  });

  $(document).on("click", "#about", function () {
    window.location.href = "/about-us";
  });

  $(document).on("click", "#change-name", function () {
    if ($("#name-change").hasClass("hiding")) {
      $("#name-change").removeClass("hiding");
    } else {
      $("#name-change").addClass("hiding");
    }
  });

  $(document).on("click", "#change-email", function () {
    if ($("#email-change").hasClass("hiding")) {
      $("#email-change").removeClass("hiding");
    } else {
      $("#email-change").addClass("hiding");
    }
  });

  $(document).on("click", "#change-password", function () {
    if ($("#password-change").hasClass("hiding")) {
      $("#password-change").removeClass("hiding");
    } else {
      $("#password-change").addClass("hiding");
    }
  });

  $(document).on("click", "#logout", function () {
    $("#logout-modal").modal("show");
  });
  $(document).on("click", ".name-close-btn", function () {
    $("#name-change-modal").modal("hide");
  });

  $(document).on("click", ".email-close-btn", function () {
    $("#email-change-modal").modal("hide");
  });

  $(document).on("click", ".password-close-btn", function () {
    $("#password-change-modal").modal("hide");
  });

  $(document).on("click", ".logout-close-btn", function () {
    $("#logout-modal").modal("hide");
  });

  $(document).on("click", ".video-call-close-btn", function () {
    $("#video-call-modal").modal("hide");
  });

  //---------------------------------------

  nameGlobalFunction = function () {
    return nameGlobal;
  };
  roomNameDynamicGlobalFunction = function () {
    return roomNameDynamicGlobal;
  };

  var roomDataGlobal;
  var roomListGlobal;
  var usernameGlobal;
  var nameGlobal;
  var roomNameDynamicGlobal;
  var onlineUserCount = 0;
  var unreadMessage = {};
  //---------------------------------------

  var socket = io();

  socketDuplicate = function () {
    return socket;
  };

  var isEqual = function (value, other) {
    var type = Object.prototype.toString.call(value);
    if (type !== Object.prototype.toString.call(other)) return false;
    if (["[object Array]", "[object Object]"].indexOf(type) < 0) return false;
    var valueLen =
      type === "[object Array]" ? value.length : Object.keys(value).length;
    var otherLen =
      type === "[object Array]" ? other.length : Object.keys(other).length;
    if (valueLen !== otherLen) return false;
    var compare = function (item1, item2) {
      var itemType = Object.prototype.toString.call(item1);
      if (["[object Array]", "[object Object]"].indexOf(itemType) >= 0) {
        if (!isEqual(item1, item2)) return false;
      } else {
        if (itemType !== Object.prototype.toString.call(item2)) return false;
        if (itemType === "[object Function]") {
          if (item1.toString() !== item2.toString()) return false;
        } else {
          if (item1 !== item2) return false;
        }
      }
    };
    // Compare properties
    if (type === "[object Array]") {
      for (var i = 0; i < valueLen; i++) {
        if (compare(value[i], other[i]) === false) return false;
      }
    } else {
      for (var key in value) {
        if (value.hasOwnProperty(key)) {
          if (compare(value[key], other[key]) === false) return false;
        }
      }
    }
    return true;
  };

  userDataDisplay = function (data) {
    $("#login-modal").modal("hide");

    $("#navbar").addClass("collapse in");

    // socket.emit('autoJoin', "");
    // socket.emit('autoJoin', roomListGlobal);

    // var roomList = [];
    oldMessageData = data.message.oldMessage;
    username = data.message.resultData[0].username;
    usernameGlobal = username;
    nameGlobal = data.message.resultData[0].name;
    email = data.message.resultData[0].email;

    roomDataGlobal = data.message.resultData[0].room;

    roomList = data.message.resultData[0].room;
    roomList = roomList.map((room) => room.roomname);
    roomListGlobal = roomList;

    socket.emit("autoJoin", roomDataGlobal); //------------autoJoin-----------------
    socket.emit("current-username", username);

    $(".user-name").text(username);

    //================sending to android=================
    try {
      var str = nameGlobal + "_" + usernameGlobal + "_" + email;
      Android.sendData(str);
    } catch (e) {}
    //===================================================

    $(".username").remove();

    roomList.forEach(function (room) {
      unreadMessage[room] = 0;
      $("ul.user-list").append(
        $('<li class="username">').html(
          '<a data-listuser="' +
            room +
            '">' +
            room +
            '<span class="unread-message"></span></a><span id="online_dot" class=""></span>'
        )
      );
      $("#status-1, #status-2").html(
        "online " +
          onlineUserCount +
          '<img id="down-icon" src="/images/icon-1.png" />'
      );
      $("#chat_main").append(
        '<div class="chat_page"><ul class="messages" id="' + room + '">'
      );
    });

    $(".chat_page").css({
      display: "none",
    });

    $(".unread-message").css({
      display: "none",
    });

    oldMessageData.forEach(function (doc) {
      // var formattedTime = moment(new Date()).format('h:mm a');
      var realUser = doc.name1 === usernameGlobal ? doc.name2 : doc.name1;

      doc.message.forEach(function (mes) {
        if (mes.from === usernameGlobal) {
          $("#" + realUser + "").append(
            $('<li class="send-message">')
              .html(
                mes.message +
                  '<span class="curr-info" style="padding-left:4px">' +
                  mes.time +
                  "</span>"
              )
              .css({
                "margin-left": "auto",
                "margin-right": "-15px",
              })
          );
          // scrolling();
        } else {
          $("#" + realUser + "").append(
            $('<li class="receive-message message_collapser">')
              .html(
                '<span class="curr-info"></span>' +
                  mes.message +
                  '<span class="curr-info" style="padding-left:3px">' +
                  mes.time +
                  "</span>"
              )
              .css({
                "margin-left": "-15px",
                "margin-right": "20%",
              })
          );
          // scrolling();
        }
      });
      scrolling();
    });
  };

  usernameDisplayInOnlineTab = function (username, newUser) {
    socket.emit("sendRoomList", username, newUser);

    socket.on("accepterRoomList", function (data) {
      roomDataGlobal = data[0].room;
      var roomUpdate = data[0].room.filter((room) => room.roomname === newUser);
      socket.emit("autoJoin", roomUpdate); //------------autoJoin-----------------

      $("ul.user-list").append(
        $('<li class="username">').html(
          '<a data-listuser="' +
            newUser +
            '">' +
            newUser +
            '<span class="unread-message"></span></a><span id="online_dot" class=""></span>'
        )
      );
      $("#status-1, #status-2").html(
        "online " +
          onlineUserCount +
          '<img id="down-icon" src="/images/icon-1.png" />'
      );
      $("#chat_main").append(
        '<div class="chat_page"><ul class="messages" id="' + newUser + '">'
      );
    });
  };

  usernameDisplay = function (data) {
    var resultData1 = data.resultData1;

    resultData1.forEach(function (row) {
      $("#search-data-display").append(
        $('<li class="search-list send-' + row.username + '-info">').html(
          "name :<span>" +
            row.name +
            '</span><br />username  : <span class="user">' +
            row.username +
            "</span>"
        )
      );
      $("#search-data-display li.send-" + row.username + "-info").append(
        $(
          '<button class="btn btn-primary send-request-btn" data-username="' +
            row.username +
            '">'
        ).text("send Request")
      );
    });
  };

  requestListDisplay = function (data) {
    var request = data.message;

    request.forEach(function (row) {
      $("#chat-request-display").append(
        $(
          '<li class="request-list request-' + row.fromusername + '-info">'
        ).html(
          "name :<span>" +
            row.fromname +
            '</span><br />username  : <span class="users">' +
            row.fromusername +
            "</span>"
        )
      );
      $(
        "#chat-request-display li.request-" + row.fromusername + "-info"
      ).append(
        $(
          '<button class="btn btn-primary chat-request-btn request-accept-btn" data-username="' +
            row.fromusername +
            '" >'
        ).text("Accept")
      );
      $(
        "#chat-request-display li.request-" + row.fromusername + "-info"
      ).append(
        $(
          '<button class="btn btn-primary chat-request-btn request-delete-btn" data-username="' +
            row.fromusername +
            '" >'
        ).text("Delete")
      );
    });
  };

  var tmp = "";
  socket.on("connect", function () {
    cache1 =
      $(".tmp-user").attr("data-id") == undefined
        ? ""
        : $(".tmp-user").attr("data-id");
    cache2 =
      $(".tmp-text").attr("data-id") == undefined
        ? ""
        : $(".tmp-text").attr("data-id");

    if (cache1.length > 0 && cache2.length > 0) {
      $(".login-btn").click();
      tmp = $(".tmp-text").attr("value");
      $(".tmp-user").attr("data-id", "");
      $(".tmp-user").removeAttr("value");
      $(".tmp-text").attr("data-id", "");
      $(".tmp-text").removeAttr("value");
    } else if ($(".username").text().length > 0) {
      $(".login-btn").click();
      $(".tmp-text").removeAttr("value");
    }

    $("#video-call-btn").css({
      display: "none",
    });
    $(".type_message").addClass("hiding");
    onlineUserCount = 0;
  });

  socket.on("disconnect", function () {
    $(".tmp-text").attr("value", tmp);
  });
  //----------------real time online-------------
  socket.on("user-offline", function (text) {
    $('a[data-listuser="' + text + '"]')
      .siblings("#online_dot")
      .removeClass("online-dot");
    onlineUserCount--;
    $("#status-1, #status-2").html(
      "online " +
        onlineUserCount +
        '<img id="down-icon" src="/images/icon-1.png" />'
    );
  });

  socket.on("online-status", function (text) {
    var fetchOnlineUser = roomDataGlobal.filter((user) => user.roomid === text);
    var onlineUser = fetchOnlineUser[0].roomname;
    $('a[data-listuser="' + onlineUser + '"]')
      .siblings("#online_dot")
      .addClass("online-dot");
    onlineUserCount++;
    $("#status-1, #status-2").html(
      "online " +
        onlineUserCount +
        '<img id="down-icon" src="/images/icon-1.png" />'
    );

    socket.emit("send-ownStatus", {
      user: usernameGlobal,
      room: fetchOnlineUser[0].roomid,
    });
  });

  socket.on("receive-ownStatus", function (user) {
    $('a[data-listuser="' + user + '"]')
      .siblings("#online_dot")
      .addClass("online-dot");
    onlineUserCount++;
    $("#status-1, #status-2").html(
      "online " +
        onlineUserCount +
        '<img id="down-icon" src="/images/icon-1.png" />'
    );
  });
  //----------------# end real time online-------------

  $(document).on("click", "li.username", function () {
    $(".type_message").removeClass("hiding");
    // var roomText = $(this).children().text();
    $("#video-call-btn").css({
      display: "block",
    });

    //================sending to android=================
    try {
      var str2 = $(this).children().attr("data-listuser");
      Android.enableCameraBtn(str2);
    } catch (e) {}
    //===================================================

    var roomText = $(this).children().attr("data-listuser");
    $("#video-call-btn").attr("data-videocall", "" + roomText + "");

    $(".heading").html(
      'Groupen<sub class="sub-heading">' + roomText + "</sub>"
    );
    roomNameDynamicGlobal = roomText;

    var roomIdFilter = roomDataGlobal.filter(
      (room) => room.roomname === roomText
    );
    var roomId = roomIdFilter[0].roomid;
    var params = {
      name: nameGlobal,
      username: usernameGlobal,
      room: roomId,
    };
    socket.emit("join", params, function (err) {
      if (err) {
        alert(err);
      } else {
      }
    });

    $(".chat_page").css({
      display: "none",
    });

    unreadMessage[roomText] = 0;
    $('a[data-listuser="' + roomText + '"] .unread-message').css({
      display: "none",
    });
    $("ul#" + roomNameDynamicGlobal + "")
      .parent()
      .css({
        display: "block",
      });
    scrolling();

    setTimeout(function () {
      $("ul#" + roomNameDynamicGlobal + " li").css({
        "box-shadow": "none",
      });
    }, 10000);
  });

  $(document).on("click", "#friend-list", function () {
    socket.emit("getFriendList", usernameGlobal);
  });
  socket.on("receiveFriendList", function (result) {
    friends = result[0].room.map((room) => room.roomname);
    $(".friend").remove();
    friends.forEach(function (room) {
      $("#friend-data-list").append(
        $('<li class="friend" data-username="' + room + '">').html(
          "<a>" + room + "</a>"
        )
      );
    });
  });

  $(document).on("click", "#online-show-btn, #online-show-btn2", function (e) {
    socket.emit("getNewRoom", usernameGlobal);
  });
  socket.on("receiveNewRoom", function (data) {
    var newLists = data[0].room;
    var oldLists = roomDataGlobal;
    roomDataGlobal = data[0].room;

    var cnt = 0;
    var modifiedRoom = [];
    newLists.forEach(function (news) {
      var res;
      var flag = false;
      oldLists.forEach(function (olds) {
        var res = isEqual(news, olds);
        if (res) {
          flag = true;
        }
      });
      if (!flag) {
        cnt++;
        modifiedRoom.push(news);
      }
    });

    if (modifiedRoom.length > 0) {
      socket.emit("autoJoin", modifiedRoom); //------------autoJoin-----------------

      modifiedRoom.forEach(function (each) {
        $("ul.user-list").append(
          $('<li class="username">').html(
            '<a data-listuser="' +
              each.roomname +
              '">' +
              each.roomname +
              '<span class="unread-message"></span></a><span id="online_dot" class=""></span>'
          )
        );
        $("#status-1, #status-2").html(
          "online " +
            onlineUserCount +
            '<img id="down-icon" src="/images/icon-1.png" />'
        );
        $("#chat_main").append(
          '<div class="chat_page"><ul class="messages" id="' +
            each.roomname +
            '">'
        );
      });
    }
  });

  $(document).on("submit", ".type_message", function (e) {
    e.preventDefault();
    scrolling();

    var text = $("#m").val();
    if (text.trim().length > 0) {
      socket.emit("createMessage", {
        text: $("#m").val(),
      });

      var formattedTime = moment(new Date()).format("h:mm a");
      $("#" + roomNameDynamicGlobal + "").append(
        $('<li class="send-message">')
          .html(
            $("#m").val() +
              '<span class="curr-info" style="padding-left:4px">' +
              formattedTime +
              "</span>"
          )
          .css({
            "margin-left": "auto",
            "margin-right": "-15px",
          })
      );
    }
    $("#m").val("");
    return false;
  });

  socket.on("newMessage", function (message) {
    var formattedTime = moment(message.createdAt).format("h:mm a");

    if (
      $("#" + message.username)
        .parent()
        .css("display") == "none"
    ) {
      $('a[data-listuser="' + message.username + '"] .unread-message').css({
        display: "block",
      });
      unreadMessage[message.username]++;
      $('a[data-listuser="' + message.username + '"] .unread-message').text(
        unreadMessage[message.username]
      );

      $("#" + message.username + "").append(
        $('<li class="receive-message message_collapser">')
          .html(
            '<span class="curr-info">' +
              message.name +
              "</span>" +
              message.text +
              '<span class="curr-info" style="padding-left:3px">' +
              formattedTime +
              "</span>"
          )
          .css({
            "margin-left": "-15px",
            "margin-right": "20%",
            "box-shadow": "0px 0px 5px 2px #00f3ff",
          })
      );
    } else {
      $("#" + message.username + "").append(
        $('<li class="receive-message message_collapser">')
          .html(
            '<span class="curr-info"></span>' +
              message.text +
              '<span class="curr-info" style="padding-left:3px">' +
              formattedTime +
              "</span>"
          )
          .css({
            "margin-left": "-15px",
            "margin-right": "20%",
          })
      );
    }
    scrolling();
  });

  socket.on("newLocationMessage", function (message) {
    var formattedTime = moment(message.createdAt).format("h:mm a");
    $("#" + message.username + "").append(
      $('<li class="receive-message">')
        .html(
          '<span class="curr-info"></span>' +
            '<a class="location" target="_blank">my Location<span class="glyphicon glyphicon-map-marker"></span></a>' +
            '<span class="curr-info" style="padding-left:3px">' +
            formattedTime +
            "</span>"
        )
        .css({
          "margin-left": "-15px",
          "margin-right": "20%",
        })
    );
    $("a.location").attr("href", message.url);

    scrolling();
  });

  var locationButton = jQuery("#send-location");
  locationButton.on("click", function () {
    if (!navigator.geolocation) {
      return alert("Geolocation not supported by your browser.");
    }

    locationButton.attr("disabled", "disabled");

    navigator.geolocation.getCurrentPosition(
      function (position) {
        locationButton.removeAttr("disabled");

        var url =
          "https://www.google.com/maps?q=" +
          position.coords.latitude +
          "," +
          position.coords.longitude;
        var formattedTime = moment(new Date()).format("h:mm a");
        $("#" + roomNameDynamicGlobal + "").append(
          $('<li class="send-message">')
            .html(
              '<a class="location" target="_blank"><span class="glyphicon glyphicon-map-marker"></span>My Location</a>' +
                '<span class="curr-info" style="padding-left:4px">' +
                formattedTime +
                "</span>"
            )
            .css({
              "margin-left": "auto",
              "margin-right": "-15px",
            })
        );
        $("a.location").attr("href", url);
        scrolling();

        socket.emit("createLocationMessage", {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      function () {
        locationButton.removeAttr("disabled");
        alert("Unable to fetch location.");
      }
    );
  });

  // ......................................................
  // ..................RTCMultiConnection Code.............
  // ......................................................

  var connection = new RTCMultiConnection();

  connection.socketURL = "/";

  connection.session = {
    audio: true,
    video: true,
  };

  connection.sdpConstraints.mandatory = {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: true,
  };
  connection.autoCloseEntireSession = true;
  connection.enableLogs = false;

  connection.onopen = function (event) {};

  connection.onclose = connection.onerror = function (event) {};

  connection.onleave = function () {};

  connection.onEntireSessionClosed = function (event) {};

  connection.onstream = function (event) {
    var video = event.mediaElement;
    video.removeAttribute("controls");

    if (event.type === "local") {
      $("#video-call-local").append(video);
    }
    if (event.type === "remote") {
      $("#video-call-remote").append(video);
    }
  };

  connection.DetectRTC.load(function () {
    connection.mediaConstraints = {
      video: {
        mandatory: {
          minWidth: 800,
          maxWidth: 800,
          minHeight: 500,
          maxHeight: 500,
          sourceId: DetectRTC.videoInputDevices[0].deviceId,
          minAspectRatio: 1.77,
        },
        optional: [
          {
            facingMode: "user",
          },
        ],
      },
      audio: true,
    };
  });

  connection.DetectRTC.load(function () {
    if (connection.DetectRTC.hasMicrophone === true) {
      connection.mediaConstraints.audio = true;
      connection.session.audio = true;
    }

    if (connection.DetectRTC.hasWebcam === true) {
      connection.mediaConstraints.video = true;
      connection.session.video = true;
    }

    if (
      connection.DetectRTC.hasMicrophone === false &&
      connection.DetectRTC.hasWebcam === false
    ) {
      connection.dontCaptureUserMedia = true;
    }

    if (connection.DetectRTC.hasSpeakers === false) {
      // checking for "false"
      alert(
        "Please attach a speaker device. You will unable to hear the incoming audios."
      );
    }
  });

  // $(document).on('click', '.flip-camera', function(e){
  //   e.preventDefault();
  //   var name = ( $('.flip-camera').text()== 'back camera' ) ? {name:'front camera',id:1} : {name:'back camera',id:0} ;
  //   $('.flip-camera').text(name.name);
  //   connection.DetectRTC.load(function(){
  //     connection.mediaConstraints = {
  //           video: {
  //             mandatory: {
  //                 minWidth: 800,
  //                 maxWidth: 800,
  //                 minHeight: 500,
  //                 maxHeight: 500,
  //                 sourceId: DetectRTC.videoInputDevices[name.id].deviceId
  //                 // minAspectRatio: 1.77
  //             },
  //             optional: [{
  //               facingMode: 'user'
  //             }]
  //         },
  //           audio: true
  //       };
  //   });
  // });
  // ......................................................
  // ................video calling Code.............
  // ......................................................

  $(document).on("click", "#video-call-btn", function (e) {
    var userid = $(this).attr("data-videocall");
    var roomid = roomDataGlobal.filter((user) => user.roomname === userid)[0]
      .roomid;
    //==================================================
    var generated_room =
      connection.token() +
      "@" +
      roomid +
      "@" +
      Math.random().toString().split(".")[1];
    //==================================================

    //================sending to android=================
    try {
      var str3 = generated_room;
      Android.disableCameraBtn(str3);
    } catch (e) {}
    //===================================================

    $("#video-call-modal").modal("show");
    $(".end-video-call-btn").attr("data-id", generated_room);

    connection.checkPresence(
      generated_room,
      function (isRoomExist, roomid, error) {
        if (isRoomExist === true) {
          connection.join(roomid);
        } else {
          connection.open(roomid);
        }
      }
    );

    socket.emit("requesting-call-sending", {
      user: userid,
      room: generated_room,
    });
  });

  var clearinterval;
  var ringtoneInterval;
  var ring = document.getElementById("call_ringtone");

  playRingtone = function () {
    ringtoneInterval = setInterval(function () {
      var playPromise = ring.play();
      if (playPromise !== undefined) {
        playPromise.then((_) => {}).catch((error) => {});
      }
    }, 1000);
  };

  pauseRingtone = function () {
    ring.pause();
  };

  socket.on("requesting-call-receiving", function (data) {
    playRingtone();
    $("#accept-call-name").text(data.name);
    $("#accept-call-username").text(data.username);
    $(".accept-video-call-btn").attr("data-caller", data.room);
    $(".reject-video-call-btn").attr("data-caller", data.room);
    $(".end-video-call-btn").attr("data-id", data.room);
    $("#accept-call-modal").modal("show");

    var i = 0;
    var txt = "Incoming call";
    clearinterval = setInterval(function () {
      if (i++ == 5) {
        txt = "Incoming call";
        i = 1;
      }
      $(".calling-text").text(txt);
      txt = $(".calling-text").text() + " .";
    }, 400);
  });

  $(document).on("click", ".accept-video-call-btn", function (e) {
    e.preventDefault();
    clearInterval(clearinterval);
    clearInterval(ringtoneInterval);
    pauseRingtone();
    var gen_room = $(this).attr("data-caller");

    $("#accept-call-modal").modal("hide");

    connection.checkPresence(gen_room, function (isRoomExist, roomid, error) {
      if (isRoomExist === true) {
        connection.join(roomid);
      } else {
        connection.open(roomid);
      }
    });

    $("#video-call-modal").modal("show");
  });

  $(document).on("click", ".reject-video-call-btn", function (e) {
    e.preventDefault();
    clearInterval(clearinterval);
    clearInterval(ringtoneInterval);
    pauseRingtone();

    //================sending to android=================
    try {
      var str4 = "enable camera btn";
      Android.enableCameraBtn(str4);
    } catch (e) {}
    //===================================================

    var gen_room = $(this).attr("data-caller");
    var soc_room = gen_room.split("@")[1] + "@" + gen_room.split("@")[2];

    $(".end-video-call-btn").attr("data-id", "");
    $("#accept-call-modal").modal("hide");
    socket.emit("rejecting-call", soc_room);
  });

  socket.on("rejecting-call", function (_blank) {
    $(".end-video-call-btn").attr("data-id", "");
    connection.attachStreams.forEach(function (localStream) {
      localStream.stop();
    });
  });

  $(document).on("click", ".end-video-call-btn", function (e) {
    //================sending to android=================
    try {
      var str5 = "enable camera btn";
      Android.enableCameraBtn(str5);
    } catch (e) {}
    //===================================================

    connection.getAllParticipants().forEach(function (pid) {
      connection.disconnectWith(pid);
    });
    connection.attachStreams.forEach(function (localStream) {
      localStream.stop();
    });

    var btn_id = $(".end-video-call-btn").attr("data-id");
    btn_id = btn_id.split("@")[1] + "@" + btn_id.split("@")[2];
    socket.emit("requesting-call-ending", btn_id);
  });

  socket.on("requesting-call-ending", function (_blank) {
    $("#accept-call-modal").modal("hide");
    clearInterval(ringtoneInterval);
    pauseRingtone();

    connection.attachStreams.forEach(function (localStream) {
      localStream.stop();
    });
  });

  connection.onstreamended = function (event) {
    $("#accept-call-name").text("");
    $("#accept-call-username").text("");
    $(".accept-video-call-btn").attr("data-caller", "");
    $(".reject-video-call-btn").attr("data-caller", "");
    $(".end-video-call-btn").attr("data-id", "");
    $("#video-call-modal").modal("hide");
    $("#video-call-local").children().remove();
    $("#video-call-remote").children().remove();
  };
});
