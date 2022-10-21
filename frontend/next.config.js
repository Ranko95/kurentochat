require('dotenv').config();
const process = require('process');

const publicRuntimeConfig = {
  socketUrl: process.env.SOCKET_URL || 'http://localhost:5000',
  turn: {
    username: process.env.TURN_USERNAME || "",
    password: process.env.TURN_PASSWORD || "",
    url: process.env.TURN_URL || "",
  },
};

const NextConfig = {
  publicRuntimeConfig,
};

module.exports = NextConfig;
