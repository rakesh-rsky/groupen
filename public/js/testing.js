var socket = io();
var f_name = "";
$(document).on("click", "#DownloadButton", function () {
  f_name = $("#NameBox").val();
  socket.emit("receiveFile", f_name);
  console.log(f_name);
});

var outerName;
var Files = {};
socket.on("Start", function (data) {
  //data contains the variables that we passed through in the html file
  console.log("receiving working......");
  var Name = data["Name"];
  outerName = Name;
  Files[Name] = {
    //Create a new Entry in The Files Variable
    FileSize: data["Size"],
    Data: "",
    Downloaded: 0,
  };
  var Place = 0;
  console.log(Name);
  console.log(data.Size);

  // try{
  //     var Stat = fs.statSync('Temp/' +  Name);
  //     if(Stat.isFile())
  //     {
  //         Files[Name]['Downloaded'] = Stat.size;
  //         Place = Stat.size / 524288;
  //     }
  // }
  // catch(er){} //It's a New File
  //         fs.open("Temp/" + Name, "a", 0755, function(err, fd){
  //             if(err)
  //             {
  //                 console.log(err);
  //             }
  //             else
  //             {
  //                 Files[Name]['Handler'] = fd; //We store the file handler so we can write to it later
  //                 socket.emit('MoreData', { 'Place' : Place, Percent : 0 });
  //             }
  //         });
});
// var FReader = new FileReader();
var dlg = false;
socket.on("fileDataReceive", function (fData) {
  open("image/jpeg", "replace");
  // charset = "utf-8";
  write(fData);
  close();
  // document.charset = "utf-8";
  dlg = execCommand("SaveAs", false, outerName + "_123" + ".jpg");
  console.log("file writing...");
});
//

//https://stackoverflow.com/questions/4771614/download-large-file-with-node-js-avoiding-high-memory-consumption

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
            socket.emit("Done", { Image: "public/Video/" + Name + ".jpg" });
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
    var Percent = (Files[Name]["Downloaded"] / Files[Name]["FileSize"]) * 100;
    socket.emit("MoreData", { Place: Place, Percent: Percent });
  }
});
