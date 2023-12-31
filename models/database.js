const mongodb = require("mongodb");
// const uri = "mongodb://localhost:27017/";
var uri = process.env.MONGODB_URI;

module.exports = {
  data_signUp: function (mode, data) {
    mongodb.MongoClient.connect(uri, { useNewUrlParser: true }, async (err, db) => {
      if (err) {
        //console.log(err);
      }
      var dbo = db.db("chatdb");

      if (mode == "verified") {
        var query1 = {
          name: data.name,
          username: data.username,
          email: data.email,
          password: data.password,
          room: [],
          request: [],
          verified: true,
        };

        var query2 = {
          email: data.email,
          otp: data.otp,
        };
        await dbo.collection("data3").insertOne(query1, (err, res) => {
          if (err) throw err;
          //console.log('data saved Successfully');
        });

        await dbo.collection("unverified").deleteOne(query2, (err, res) => {
          if (err) throw err;
          //console.log('unverified data deleted..', res.deletedCount);
        });

        setTimeout(() => {db.close()}, 1500);
      } else {
        var query1 = {
          name: data.name,
          username: data.username,
          email: data.email,
          password: data.password,
          otp: data.otp,
        };
        await dbo.collection("unverified").insertOne(query1, (err, res) => {
          if (err) throw err;
          //console.log('data saved Successfully');
        });
        setTimeout(() => {db.close()}, 1500);
      }
    });
  },

  data_unverified: function (data) {
    return new Promise(function (resolve, reject) {
      var result;
      mongodb.MongoClient.connect(uri, { useNewUrlParser: true }, async (err, db) => {
        if (err) {
          //console.log(err);
        }
        var dbo = db.db("chatdb");

        await dbo
          .collection("unverified")
          .find(data, { projection: { _id: 0 } })
          .toArray((err, res) => {
            if (err) throw err;
            result = res;
            resolve(res);
          });
        setTimeout(() => {db.close()}, 1500);
      });
    });
  },

  data_contact: function (data) {
    return new Promise(function (resolve, reject) {
      mongodb.MongoClient.connect(uri, { useNewUrlParser: true }, async (err, db) => {
        if (err) {
          //console.log(err);
        }
        var dbo = db.db("chatdb");
        var query = {
          fullname: data.fullname,
          email: data.email,
          message: data.message,
          date: new Date(),
        };
        await dbo.collection("contact").insertOne(query, (err, res) => {
          if (err) throw err;
          //console.log('contact mesasage received..');
          resolve(res);
        });
        setTimeout(() => {db.close()}, 1500);
      });
    });
  },

  data_saveMessage: function (data) {
    var result;

    mongodb.MongoClient.connect(uri, { useNewUrlParser: true }, async (err, db) => {
      if (err) {
        //console.log(err);
      }
      var dbo = db.db("chatdb");
      var query = { roomid: data.room };
      // var query = {'username':data.to ,'from':data.from};
      // var str= 'from.'+data.from+'';

      // var push = {$push: { [str]:{ 'time':data.time, 'ip':data.ip, 'message':data.message }  } };
      var push = {
        $push: {
          message: {
            time: data.time,
            ip: data.ip,
            from: data.from,
            message: data.message,
            read: data.read,
          },
        },
      };

      await dbo.collection("data4").updateOne(query, push, (err, res) => {
        if (err) throw err;
      });
      setTimeout(() => {db.close()}, 1500);
    });
  },

  data_loginVerify: function (data) {
    return new Promise(async function (resolve, reject) {
      var result;
      await mongodb.MongoClient.connect(uri, { useNewUrlParser: true }, async (err, db) => {
        if (err) {
          //console.log(err);
        }
        var dbo = db.db("chatdb");
        // await dbo.collection('data3').find(data, { projection:{ _id:0, password:0 } }).toArray((err, res)=>{
        await dbo
          .collection("data3")
          .find(data, { projection: { _id: 0 } })
          .toArray((err, res) => {
            if (err) throw err;
            result = res;
            resolve(res);
          });
          setTimeout(() => {db.close()}, 1500)
      });
    });
  },

  data_oldMessage: function (data) {
    return new Promise(function (resolve, reject) {
      var result;
      var query = { $or: [{ name1: data.username }, { name2: data.username }] };
      mongodb.MongoClient.connect(uri, { useNewUrlParser: true }, async (err, db) => {
        if (err) {
          //console.log(err);
        }
        var dbo = db.db("chatdb");
        await dbo
          .collection("data4")
          .find(query)
          .toArray((err, res) => {
            if (err) throw err;
            resolve(res);
          });
        setTimeout(() => {db.close()}, 1500)
      });
    });
  },

  data_allUserList: function (data) {
    return new Promise(function (resolve, reject) {
      var result1;
      // var query1 ={'name':data.user_search};
      // var query1 = {'name':{$regex:"^" + data.user_search + ".*", $options:"i" }};
      // var query1 = {$or:[ {'name':data.user_search}, {'username':data.user_search} ]};
      var query1 = {
        $or: [
          {
            name: { $regex: "^" + data.user_search + ".*", $options: "i" },
          },
          {
            username: { $regex: "^" + data.user_search + ".*", $options: "i" },
          },
        ],
      };

      mongodb.MongoClient.connect(
        uri,
        { useNewUrlParser: true },
        async function (err, db) {
          if (err) {
            //console.log(err);
          }
          var dbo = db.db("chatdb");
          await dbo
            .collection("data3")
            .find(query1, { projection: { _id: 0, name: 1, username: 1 } })
            .toArray(function (err, res1) {
              if (err) throw err;
              result1 = res1;
              //console.log('in database 1');
              //console.log(res1);
              resolve(result1);
            });
          setTimeout(() => {db.close()}, 1500);
        }
      );
    });
  },

  data_sendRequest: function (data) {
    return new Promise(function (resolve, reject) {
      var query = { username: data.to };
      var push = {
        $push: {
          request: { fromname: data.fromName, fromusername: data.fromUsername },
        },
      };
      mongodb.MongoClient.connect(
        uri,
        { useNewUrlParser: true },
        async function (err, db) {
          if (err) {
            //console.log(err);
          }
          var dbo = db.db("chatdb");
          //console.log()
          await dbo.collection("data3").updateOne(query, push, function (err, res) {
            if (err) {
              //console.log(err);
            }
            // //console.log(res);
            //console.log('data saved....');
            resolve(res);
          });
          setTimeout(() => {db.close()}, 1500);
        }
      );
    });
  },

  data_getRequest: function (data) {
    return new Promise(function (resolve, reject) {
      var query = { username: data.username };
      mongodb.MongoClient.connect(
        uri,
        { useNewUrlParser: true },
        async function (err, db) {
          if (err) {
            //console.log(err);
          }
          var dbo = db.db("chatdb");
          // //console.log();
          await dbo
            .collection("data3")
            .find(query, { projection: { _id: 0, request: 1 } })
            .toArray(function (err, res) {
              if (err) {
                //console.log(err);
              }
              //console.log(res);
              resolve(res);
            });
          setTimeout(() => {db.close()}, 1500);
        }
      );
    });
  },

  data_getFriend: function (data) {
    return new Promise(function (resolve, reject) {
      var query = { username: data };
      mongodb.MongoClient.connect(
        uri,
        { useNewUrlParser: true },
        async function (err, db) {
          if (err) {
            //console.log(err);
          }
          var dbo = db.db("chatdb");
          // //console.log();
          await dbo
            .collection("data3")
            .find(query, { projection: { _id: 0, room: 1 } })
            .toArray(function (err, res) {
              if (err) {
                //console.log(err);
              }
              // //console.log(res);
              resolve(res);
            });
          setTimeout(() => {db.close()}, 1500);
        }
      );
    });
  },

  data_acceptRequest: function (data) {
    var query1 = { username: data.accepter };
    var query2 = { username: data.requester };
    var query3 = { username: data.accepter };

    var query4 = {
      roomid: data.roomid,
      name1: data.accepter,
      name2: data.requester,
      message: [],
    };
    // var query4 = {
    //   'username':data.accepter,
    //   'from':data.requester,
    //   'message':[]
    // };

    // var query5 = {
    //   'username':data.requester,
    //   'from':data.accepter,
    //   'message':[]
    // };

    var push1 = {
      $push: { room: { roomname: data.requester, roomid: data.roomid } },
    };
    var push2 = {
      $push: { room: { roomname: data.accepter, roomid: data.roomid } },
    };
    var pull1 = { $pull: { request: { fromusername: data.requester } } };

    mongodb.MongoClient.connect(
      uri,
      { useNewUrlParser: true },
      async function (err, db) {
        if (err) {
          //console.log(err);
        }
        var dbo = db.db("chatdb");
        //console.log()

        await dbo.collection("data3").updateOne(query1, push1, function (err, res) {
          if (err) {
            //console.log(err);
          }
          //console.log('data saved..1..');
        });

        await dbo.collection("data3").updateOne(query2, push2, function (err, res) {
          if (err) {
            //console.log(err);
          }
          //console.log('data saved..2..');
        });

        await dbo.collection("data3").updateOne(query3, pull1, function (err, res) {
          if (err) {
            //console.log(err);
          }
          //console.log('request deleted...');
        });

        await dbo.collection("data4").insertOne(query4, function (err, res) {
          if (err) {
            //console.log(err);
          }
          //console.log('inserting query 4 done..');
        });

        // await dbo.collection('data4').insertOne(query5, function(err,res){
        //   if(err) {
        //     //console.log(err);
        //   };
        //   //console.log('query 5 done..');
        // });

        setTimeout(() => {db.close()}, 1500);
      }
    );
  },

  data_deleteRequest: function (data) {
    var query1 = { username: data.accepter };

    var pull1 = { $pull: { request: { fromusername: data.requester } } };

    mongodb.MongoClient.connect(
      uri,
      { useNewUrlParser: true },
      async function (err, db) {
        if (err) {
          //console.log(err);
        }
        var dbo = db.db("chatdb");
        //console.log()

        await dbo.collection("data3").updateOne(query1, pull1, function (err, res) {
          if (err) {
            //console.log(err);
          }
          //console.log('request deleted...');
        });

        setTimeout(() => {db.close()}, 1500);
      }
    );
  },

  data_getUsername: function (data) {
    return new Promise(function (resolve, reject) {
      var query = { username: data };
      mongodb.MongoClient.connect(
        uri,
        { useNewUrlParser: true },
        async function (err, db) {
          if (err) {
            //console.log(err);
          }
          var dbo = db.db("chatdb");
          // //console.log();
          await dbo
            .collection("data3")
            .find(query, { projection: { _id: 0, username: 1 } })
            .toArray(function (err, res) {
              if (err) {
                //console.log(err);
              }
              //console.log(res);
              resolve(res);
            });
          setTimeout(() => {db.close()}, 1500);
        }
      );
    });
  },

  data_getEmail: function (data) {
    return new Promise(function (resolve, reject) {
      var query = { email: data };
      mongodb.MongoClient.connect(
        uri,
        { useNewUrlParser: true },
        async function (err, db) {
          if (err) {
            //console.log(err);
          }
          var dbo = db.db("chatdb");
          // //console.log();
          await dbo
            .collection("data3")
            .find(query, { projection: { _id: 0, email: 1 } })
            .toArray(function (err, res) {
              if (err) {
                //console.log(err);
              }
              //console.log(res);
              resolve(res);
            });
          setTimeout(() => {db.close()}, 1500);
        }
      );
    });
  },

  data_getRoomList: function (data) {
    return new Promise(function (resolve, reject) {
      var query = { username: data };
      mongodb.MongoClient.connect(
        uri,
        { useNewUrlParser: true },
        async function (err, db) {
          if (err) {
            //console.log(err);
          }
          var dbo = db.db("chatdb");
          // //console.log();
          await dbo
            .collection("data3")
            .find(query, { projection: { _id: 0, room: 1 } })
            .toArray(function (err, res) {
              if (err) {
                //console.log(err);
              }
              //console.log(res);
              resolve(res);
            });
          setTimeout(() => {db.close()}, 1500);
        }
      );
    });
  },

  data_newName: function (data) {
    return new Promise((resolve, reject) => {
      var query = { username: data.username, password: data.password };
      var up = { $set: { name: data.newname } };
      mongodb.MongoClient.connect(
        uri,
        { useNewUrlParser: true },
        async function (err, db) {
          if (err) {
            //console.log(err);
          }
          var dbo = db.db("chatdb");
          await dbo.collection("data3").updateOne(query, up, (err, res) => {
            if (err) throw err;
            resolve(res);
          });
          setTimeout(() => {db.close()}, 1500);
        }
      );
    });
  },

  data_newEmail: function (data) {
    return new Promise((resolve, reject) => {
      var query = { username: data.username, password: data.password };
      var up = { $set: { email: data.newemail } };
      mongodb.MongoClient.connect(
        uri,
        { useNewUrlParser: true },
        async function (err, db) {
          if (err) {
            //console.log(err);
          }
          var dbo = db.db("chatdb");
          await dbo.collection("data3").updateOne(query, up, (err, res) => {
            if (err) throw err;
            resolve(res);
          });
          setTimeout(() => {db.close()}, 1500);
        }
      );
    });
  },

  data_newPassword: function (data) {
    return new Promise((resolve, reject) => {
      var query = { username: data.username, password: data.password };
      var up = { $set: { password: data.newpassword } };
      mongodb.MongoClient.connect(
        uri,
        { useNewUrlParser: true },
        async function (err, db) {
          if (err) {
            //console.log(err);
          }
          var dbo = db.db("chatdb");
          await dbo.collection("data3").updateOne(query, up, (err, res) => {
            if (err) throw err;
            resolve(res);
          });
          setTimeout(() => {db.close()}, 1500);
        }
      );
    });
  },
};
