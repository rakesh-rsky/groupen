const database = require("./database");
const timeist = require("./timeist");
const { Users } = require("./user.js");
const { isRealString } = require("./validation");
const { generateMessage, generateLocationMessage } = require("./message");
const home = require("../controller/home");
const RTCMultiConnectionServer = require("rtcmulticonnection-server");
var fs = require("fs");
var exec = require("child_process").exec;
var util = require("util");

module.exports = {
  custom_socket: function (io) {
    var users = new Users();

    var userCount = 0;

    io.on("connection", function (socket) {
      // console.log('connected on server...');
      RTCMultiConnectionServer.addSocket(socket);
      // console.log('New user connected');
      // io.emit('username-request','');

      socket.on("autoJoin", function (roomList) {
        // console.log(roomList);
        roomList.forEach(function (room) {
          socket.join(room.roomid);
          socket.broadcast.to(room.roomid).emit("online-status", room.roomid);
        });
      });

      socket.on("send-ownStatus", function (user) {
        socket.broadcast.to(user.room).emit("receive-ownStatus", user.user);
      });
      // socket.on('current-username',function(user){
      //
      // });

      socket.on("join", (params) => {
        // console.log(params);

        if (!isRealString(params.username) || !isRealString(params.room)) {
          return callback("username and rooms are requires");
        }
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.username, params.room);

        // io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        // io.emit('updateRoomList', users.getRoomList());
        // console.log(socket.id);
        // console.log(params.room);
        // socket.emit('newMessage', generateMessage('','Admin','Welcome to chat app.') );
        // socket.broadcast.to(params.room).emit('newMessage',generateMessage('',`${params.username} has joined`,''));
        // callback();
      });

      socket.on("createMessage", (message, callback) => {
        var user = users.getUser(socket.id);
        var time = timeist.timeist();

        if (user && isRealString(message.text)) {
          socket.volatile.broadcast
            .to(user.room)
            .emit(
              "newMessage",
              generateMessage(user.name, user.username, message.text)
            );
          // socket.on('checking',function(stat){
          //   if(stat){
          //     console.log('message reached to client...');
          //   }else{
          //     console.log('not received...');
          //   }
          // });
          // socket.leave(user.room); we can use to leave to the room...

          database.data_getFriend(user.username).then(function (result) {
            var rooms = result[0].room.filter(
              (room) => room.roomid === user.room
            );
            var receiverName = rooms[0].roomname;
            var ip = socket.request.connection.remoteAddress
              .toString()
              .split(":")[3];

            database.data_saveMessage({
              time: time,
              ip: ip,
              room: user.room,
              from: user.username,
              to: receiverName,
              message: message.text,
              read: true,
            });
          });
        }
        // callback('message received..');
      });

      socket.on("createLocationMessage", (coords) => {
        var user = users.getUser(socket.id);

        if (user) {
          socket.volatile.broadcast
            .to(user.room)
            .emit(
              "newLocationMessage",
              generateLocationMessage(
                user.name,
                user.username,
                coords.latitude,
                coords.longitude
              )
            );
          // io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
      });

      socket.on("requesting-call-sending", function (data) {
        var user = users.getUser(socket.id);
        socket.broadcast.to(user.room).emit("requesting-call-receiving", {
          name: user.name,
          username: user.username,
          room: data.room,
        });
      });

      socket.on("requesting-call-ending", function (room) {
        // var user = users.getUser(socket.id) || "empty";
        // var soc_room = (room=="")? users.getUser(socket.id).room : room ;
        socket.broadcast.to(room).emit("requesting-call-ending", "");
        // console.log('soc room =='+ room);
        // console.log(soc_room);
      });

      socket.on("rejecting-call", function (room) {
        socket.broadcast.to(room).emit("rejecting-call", "");
      });

      socket.on("getNewRoom", function (username) {
        database.data_getFriend(username).then(function (result) {
          socket.emit("receiveNewRoom", result);
        });
      });

      socket.on("getFriendList", function (username) {
        database.data_getFriend(username).then(function (result) {
          socket.emit("receiveFriendList", result);
        });
      });

      socket.on("sendRoomList", function (username, newUser) {
        database.data_getRoomList(username).then(function (result) {
          var oneRow = result[0].room.filter(
            (room) => room.roomname == newUser
          );
          // console.log('in socket data');
          socket.emit("accepterRoomList", result);
        });
      });

      socket.on("current-username", function (c_user) {
        socket.on("disconnect", function () {
          var cl_user = users.removeUser(socket.id);
          // socket.reconnect();
          // console.log('user disconected from server..');
          cl_user =
            cl_user == undefined || cl_user == "undefined"
              ? ""
              : cl_user.username;
          user = cl_user == "" ? c_user : cl_user;
          database.data_getRoomList(user).then(function (result) {
            result[0].room.forEach(function (onerow) {
              socket.broadcast.to(onerow.roomid).emit("user-offline", user);
            });
          });
          // if(user){
          //   io.to(user.room).emit('updateUserList',users.getUserList(user.room));
          //   // io.to(user.room).emit('newMessage', generateMessage('','Admin', `${user.username} has left.`));
          // }
        });
      });

      //-----------------------------------------
      //-----------file uploading----------------
      //-----------------------------------------
      var Files = {};
      socket.on("Start", function (data) {
        //data contains the variables that we passed through in the html file
        var Name = data["Name"];
        Files[Name] = {
          //Create a new Entry in The Files Variable
          FileSize: data["Size"],
          Data: "",
          Downloaded: 0,
        };
        var Place = 0;
        try {
          var Stat = fs.statSync("Temp/" + Name);
          if (Stat.isFile()) {
            Files[Name]["Downloaded"] = Stat.size;
            Place = Stat.size / 524288;
          }
        } catch (er) {} //It's a New File
        fs.open("Temp/" + Name, "a", function (err, fd) {
          if (err) {
            // console.log(err);
          } else {
            Files[Name]["Handler"] = fd; //We store the file handler so we can write to it later
            socket.emit("MoreData", { Place: Place, Percent: 0 });
          }
        });
      });

      //--------

      socket.on("Upload", function (data) {
        var Name = data["Name"];
        Files[Name]["Downloaded"] += data["Data"].length;
        Files[Name]["Data"] += data["Data"];
        if (Files[Name]["Downloaded"] == Files[Name]["FileSize"]) {
          //If File is Fully Uploaded
          fs.write(
            Files[Name]["Handler"],
            Files[Name]["Data"],
            null,
            "Binary",
            function (err, Writen) {
              //Get Thumbnail Here
              var inp = fs.createReadStream("Temp/" + Name);
              var out = fs.createWriteStream("Video/" + Name);
              inp.pipe(out);
              inp.on("end", function () {
                fs.unlink("Temp/" + Name, function () {
                  //This Deletes The Temporary File
                  //Moving File Completed
                });
              });

              exec(
                "ffmpeg -i Video/" +
                  Name +
                  " -ss 01:10 -r 1 -an -vframes 1 -f mjpeg public/Video/" +
                  Name +
                  ".jpg",
                function (err) {
                  socket.emit("Done", {
                    Image: "public/Video/" + Name + ".jpg",
                  });
                }
              );
            }
          );
        } else if (Files[Name]["Data"].length > 10485760) {
          //If the Data Buffer reaches 10MB
          fs.write(
            Files[Name]["Handler"],
            Files[Name]["Data"],
            null,
            "Binary",
            function (err, Writen) {
              Files[Name]["Data"] = ""; //Reset The Buffer
              var Place = Files[Name]["Downloaded"] / 524288;
              var Percent =
                (Files[Name]["Downloaded"] / Files[Name]["FileSize"]) * 100;
              socket.emit("MoreData", { Place: Place, Percent: Percent });
            }
          );
        } else {
          var Place = Files[Name]["Downloaded"] / 524288;
          var Percent =
            (Files[Name]["Downloaded"] / Files[Name]["FileSize"]) * 100;
          socket.emit("MoreData", { Place: Place, Percent: Percent });
        }
      });
    });
  },
};
