class Users {
  constructor() {
    this.users = [];
  }
  addUser(id, name, username, room) {
    var user = { id, name, username, room };
    this.users.push(user);
    return user;
  }
  getUser(id) {
    return this.users.filter((user) => user.id === id)[0];
  }
  removeUser(id) {
    var user = this.getUser(id);
    if (user) {
      this.users = this.users.filter((user) => user.id !== id);
    }
    return user;
  }
  getUserList(room) {
    var users = this.users.filter((user) => user.room === room);

    var namesArray = users.map((user) => user.username);
    return namesArray;
  }
  getRoomList() {
    var roomArray = this.users.map((user) => user.room);
    var newRoomArray = [];
    for (var i = 0; i < roomArray.length; i++) {
      if (roomArray[i] !== "") {
        for (var j = i + 1; j < roomArray.length; j++) {
          if (roomArray[i] === roomArray[j]) {
            roomArray[j] = "";
          }
        }
        newRoomArray.push(roomArray[i]);
      }
    }
    return newRoomArray;
  }
}

module.exports = { Users };
