const mongoose = require("mongoose");
mongoose.Promise = Promise;

mongoose
  .connect("mongodb://mongo:27017", {
    useNewUrlParser: false,
    autoReconnect: true
  })
  .then(data => {
    console.log("Connected to database");
  })
  .catch(err => {
    console.log("Error : ", err);
  });

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  mail: String,
  project: String,
  shouldReceiveUpdate: Boolean
});

const User = mongoose.model("User", userSchema);

const addUser = user => new User(user).save();

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
  console.log(project) || User.find({ project }).exec();

module.exports = {
  addUser,
  getUsers,
  findUsersByProject
};
