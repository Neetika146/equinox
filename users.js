class User {
    constructor(username, password) {
      this.username = username;
      this.password = password;
    }
  
    checkPassword(password) {
      return bcrypt.compareSync(password, this.password);
    }
  }
  
  class Users {
    constructor() {
      this.users = [];
    }
  
    addUser(username, password) {
      const hash = bcrypt.hashSync(password, 10);
      const user = new User(username, hash);
      this.users.push(user);
      return user;
    }
  
    getUser(username) {
      return this.users.find((user) => user.username === username);
    }
  }
  
  module.exports = Users;
  