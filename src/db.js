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
