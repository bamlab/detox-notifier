const mongoose = require("mongoose");
mongoose.Promise = Promise;

const initConnection = () =>
  mongoose
    .connect("mongodb://mongo:27017", {
      useNewUrlParser: false,
      autoReconnect: true
    })
    .then(() => console.log("Connected to database"))
    .catch(err => {
      console.log("Error connecting to database, retrying in 1 second");
      setTimeout(initConnection, 1000);
    });

initConnection();
