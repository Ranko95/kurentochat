import { WebRtcEndpoint, getComplexType, IceCandidate as IceCandidateType } from "kurento-client";
import { IceServersProvider } from "../ice-servers/IceServersProvider";

const IceCandidate = getComplexType('IceCandidate');

type OnIceCandidateCb = (candidate: any) => void;

export class VideoStream {
  userId: string;
  callId: string;
  endpoint: WebRtcEndpoint;
  connectedToUser?: string = undefined;

  constructor(data: { userId: string, callId: string, endpoint: WebRtcEndpoint, onIceCandidate: OnIceCandidateCb, connectedToUser?: string }) {
    this.userId = data.userId;
    this.callId = data.callId;
    this.endpoint = data.endpoint;
    this.endpoint.on('OnIceCandidate', (event) => data.onIceCandidate(IceCandidate(event.candidate)));
    this.connectedToUser = data.connectedToUser;
  }

  processOffer = async (sdp: string) => this.endpoint.processOffer(sdp);

  gatherIceCandidates = async () => {
    await this.endpoint.gatherCandidates();
  };

  addCandidates = async (candidates: IceCandidateType[]) => {
    candidates.forEach((c: any) => this.addCandidate(c));
  };

  addCandidate = async (candidate: IceCandidateType) => {
    await this.endpoint.addIceCandidate(IceCandidate(candidate));
  };

  stop = async () => {
    await this.endpoint.release();
  };

  configureEndpoint = async () => {
    const iceServers = IceServersProvider.getIceServersForKurento();
  
    await this.endpoint.setStunServerAddress(iceServers.stun.ip);
    await this.endpoint.setStunServerPort(iceServers.stun.port)
    await this.endpoint.setTurnUrl(iceServers.turn);
  };
}
