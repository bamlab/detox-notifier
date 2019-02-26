const PushBullet = require("pushbullet");
const axios = require("axios");
const { map, reduce } = require("ramda");
const accessToken = process.env.PUSHBULLET_API;
const pusher = new PushBullet(accessToken);

const { findUsersByProject } = require("./db");

const NOTE_TITLE = "Detox CI";

let modifiedAfter = Math.floor(new Date().getTime() / 1000);

const handlePush = (sender, message) => {
  if (message === "Alfred ?") {
    sendNote(sender, "Sir ! Gotham needs you ! Batman must return !");
  }
  if (message.toLowerCase() === "stop") {
    updateShouldReceive(sender);
  }
};

const handleNewPushes = async () => {
  const {
    data: { pushes }
  } = await axios.get(
    `https://api.pushbullet.com/v2/pushes?modified_after=${modifiedAfter}`,
    {
      headers: {
        "Access-Token": accessToken
      }
    }
  );
  pushes.map(push => {
    if (push.modified > modifiedAfter) {
      modifiedAfter = push.modified;
    }
    // Here handle push
    handlePush(push.sender_email, push.body);
  });
};

const initStream = () => {
  const stream = pusher.stream();

  stream.on("connect", () => console.log("Connected to stream"));

  stream.on("tickle", handleNewPushes);

  stream.connect();
};

const getDevices = async () => {
  const { devices } = await pusher.devices();
  return devices;
};

const isDetoxCiDeviceCreated = () =>
  getDevices().then(
    reduce((acc, device) => acc || device.nickname === "detox-ci", false)
  );

const createDetoxCiDeviceIfNeeded = () =>
  isDetoxCiDeviceCreated().then(isCreated =>
    isCreated
      ? Promise.resolve(
          pusher.createDevice({
            nickname: "detox-ci"
          })
        )
      : Promise.resolve()
  );

const sendNote = (mail, body) => pusher.note(mail, NOTE_TITLE, body);

const broadCastNote = (project, note) =>
  findUsersByProject(project).then(
    map(user => Promise.resolve(sendNote(user.mail, note)))
  );

const initPushBulletStream = () =>
  createDetoxCiDeviceIfNeeded().then(initStream);

module.exports = {
  broadCastNote,
  initPushBulletStream
};
