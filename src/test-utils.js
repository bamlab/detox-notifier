const { reduce } = require("ramda");

const { broadCastNote } = require("./pushbullet");

const areTestFailing = reduce(
  (acc, currentTest) => acc || currentTest.fail,
  false
);

const formatTestResults = reduce(
  (acc, currentTest) =>
    currentTest.fail ? `${acc}\n${currentTest.name} failed` : acc,
  ""
);

module.exports = {
  areTestFailing,
  formatTestResults
};
