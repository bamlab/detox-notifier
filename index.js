require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

require("./src/db");

const { initPushBulletStream } = require("./src/pushbullet");

initPushBulletStream();

app.use(bodyParser.json());

require("./src/routes")(app);

app.listen(6767, () => {
  console.log("Server running on port 6767");
});
