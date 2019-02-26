const mongoose = require("mongoose");
const { isNil } = require("ramda");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  mail: String,
  project: String,
  shouldReceiveUpdate: Boolean
});

const User = mongoose.model("User", userSchema);

const addUser = user =>
  User.findOne({ mail: user.mail })
    .exec()
    .then(result => {
      if (isNil(result)) {
        return Promise.resolve(new User(user).save());
      }
      return Promise.reject("MAIL_ALREADY_EXISTS");
    });

const getUsers = () =>
  User.find({})
    .select({
      name: 1,
      mail: 1,
      shouldReceiveUpdate: 1,
      project: 1
    })
    .exec();

const findUsersByProject = project =>
  User.find({ project, shouldReceiveUpdate: true }).exec();

const deleteUser = mail => User.deleteOne({ mail }).exec();

const updateUser = ({ mail, ...rest }) => User.updateOne({ mail }, rest).exec();

module.exports = {
  addUser,
  getUsers,
  findUsersByProject,
  deleteUser,
  updateUser
};
