const { broadCastNote } = require("./pushbullet");

const { addUser, getUsers } = require("./db");

const { areTestFailing, formatTestResults } = require("./test-utils");

module.exports = app => {
  app.post("/api/results/:project", (req, res, next) =>
    Promise.resolve(req.body)
      .then(testsResults => {
        if (areTestFailing(testsResults)) {
          broadCastNote(req.params.project, formatTestResults(testsResults));
        }
        res.status(204).send();
      })
      .catch(error => res.status(500).send(error))
  );

  app.post("/api/user", (req, res, next) =>
    Promise.resolve(req.body)
      .then(addUser)
      .catch(error => console.log("error", error))
  );

  app.get("/api/users", (req, res, next) =>
    getUsers()
      .then(users => res.send(users))
      .catch(error => res.status(500).send(error))
  );
};
