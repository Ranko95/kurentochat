import { vars } from "../../config/vars";

type Turn = string;
type Stun = {
  ip: string;
  port: number;
};

interface IceServers {
  turn: Turn;
  stun: Stun;
}

export class IceServersProvider {
  static getIceServersForKurento = (): IceServers => ({
    turn: vars.turnUrl,
    stun: {
      ip: "stun.l.google.com",
      port: 19302,
    },
  });
}
