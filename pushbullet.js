const PushBullet = require("pushbullet");
const axios = require("axios");
const accessToken = process.env.PUSHBULLET_API;
const pusher = new PushBullet(accessToken);

const { users } = require("./config");

const NOTE_TITLE = "Detox CI";

let modifiedAfter = Math.floor(new Date().getTime() / 1000);

const handlePush = (sender, message) => {
  if (message === "Alfred ?") {
    sendNote(sender, "Sir ! Gotham needs you ! Batman must return !");
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

const isDetoxCiDeviceCreated = async () => {
  const devices = await getDevices();
  return devices.reduce(
    (acc, device) => acc || device.nickname === "detox-ci",
    false
  );
};

const createDetoxCiDeviceIfNeeded = async () => {
  if (!(await isDetoxCiDeviceCreated())) {
    const deviceOptions = {
      nickname: "detox-ci"
    };
    await pusher.createDevice(deviceOptions);
  }
};

const sendNote = async (id, body) => {
  await pusher.note(id, NOTE_TITLE, body);
};

const broadCastNote = async (project, note) => {
  if (!users[project]) {
    throw new Error("Project does not exist");
  }
  await users[project].map(async user => {
    await sendNote(user[user.type], note);
  });
};

const initPushBulletStream = async () => {
  try {
    await createDetoxCiDeviceIfNeeded();
    initStream();
  } catch (error) {
    console.log("error", error);
  }
};

module.exports = {
  broadCastNote,
  initPushBulletStream
};
