require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const { initPushBulletStream, broadCastNote } = require("./pushbullet");

initPushBulletStream();

app.use(bodyParser.json());

app.post("/detox/:project", async (req, res, next) => {
  try {
    const {
      body: { tests }
    } = req;
    const areTestFailing = tests.reduce(
      (acc, currentTest) => acc || currentTest.fail,
      false
    );
    if (areTestFailing) {
      const formattedTestResults = tests.reduce(
        (acc, currentTest) =>
          currentTest.fail ? `${acc}\n${currentTest.name} failed` : acc,
        ""
      );
      await broadCastNote(req.params.project, formattedTestResults);
    }
    res.status(204).send();
  } catch (error) {
    console.log("error", error);
    res.status(500).send();
  }
});

app.listen(6767, () => {
  console.log("Server running on port 6767");
});
