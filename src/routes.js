const { broadCastNote } = require("./pushbullet");

const { addUser, getUsers, deleteUser, updateUser } = require("./user");

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
      .then(user => res.send(user))
      .catch(error => res.status(500).send(error))
  );

  app.get("/api/users", (req, res, next) =>
    getUsers()
      .then(users => res.send(users))
      .catch(error => res.status(500).send(error))
  );

  app.delete("/api/user", (req, res, next) =>
    Promise.resolve(req.body)
      .then(({ mail }) => {
        if (mail) {
          return Promise.resolve(deleteUser(mail));
        }
        return res.status(400).send();
      })
      .then(() => res.status(204).send())
      .catch(error => res.status(500).send(error))
  );

  app.put("/api/user", (req, res, next) =>
    Promise.resolve(req.body)
      .then(updateUser)
      .then(() => res.status(204).send())
      .catch(error => res.status(500).send(error))
  );
};
