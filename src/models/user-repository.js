const { users } = require('./db');
const uuid = require('uuid');
var bcrypt = require('bcryptjs');

exports.getUsers = () => users;

exports.getUserByFirstName = (firstName) => {
  return users.find((user) => user.firstName == firstName);
};

exports.createUser = (body) => {
  var salt = bcrypt.genSaltSync(12);
  const hashedPassword = bcrypt.hashSync(body.password,salt);
  const user = body;
  user.id = uuid.v4();
  user.password = hashedPassword;

  users.push(user);
};

exports.updateUser = (id, data) => {
  const foundUser = users.find((user) => user.id == id);
  var salt = bcrypt.genSaltSync(12);

  if (!foundUser) {
    throw new Error('User not found');
  }

  foundUser.firstName = data.firstName || foundUser.firstName;
  foundUser.lastName = data.lastName || foundUser.lastName;
  foundUser.password = data.password ? bcrypt.hashSync(data.password,salt) : foundUser.password;
};

exports.deleteUser = (id) => {
  const userIndex = users.findIndex((user) => user.id == id);

  if (userIndex === -1) {
    throw new Error('User not foud');
  }

  users.splice(userIndex, 1);
}
