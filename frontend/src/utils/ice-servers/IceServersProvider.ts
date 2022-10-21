import config from "src/config/publicConfig";

export class IceServersProvider {
  static getIceServers = (): RTCIceServer[] => [
    {
      username: config.turn.username,
      credential: config.turn.password,
      urls: [`turn:${config.turn.url}`],
    },
    {
      urls: ['stun:stun.l.google.com:19302'],
    },
  ];
}
