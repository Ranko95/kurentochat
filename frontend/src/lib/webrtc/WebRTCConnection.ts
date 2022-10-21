import 'webrtc-adapter';
import { getUserMedia } from 'src/helpers/media.helpers';

export enum ConnectionTypes {
  Publish = 'publish',
  View = 'view',
}

type OnGotStreamCb = (stream: MediaStream, publishCallId?: string) => void;
type OnGotOfferCb = (sdp: string | undefined, callId: string) => void;
type OnGotIceCandidateCb = (candidate: RTCIceCandidate, callId: string) => void;

export interface IWebRTCConnectionData {
  callId: string;
  type: ConnectionTypes;
  iceServers: RTCIceServer[];
  publishCallId?: string;
  onGotStream?: OnGotStreamCb;
  onGotOffer?: OnGotOfferCb;
  onGotIceCandidate?: OnGotIceCandidateCb;
}

export class WebRTCConnection {
  callId: string;
  type: ConnectionTypes;
  iceServers: RTCIceServer[];
  publishCallId?: string;
  onGotStream?: OnGotStreamCb;
  onGotOffer?: OnGotOfferCb;
  onGotIceCandidate?: OnGotIceCandidateCb;

  peerConnection: RTCPeerConnection | null = null;

  localStream: MediaStream | null = null;
  stream: MediaStream | null = null;

  sdpAnswerSet: boolean = false;

  constructor(data: IWebRTCConnectionData) {
    this.callId = data.callId;
    this.type = data.type;
    this.publishCallId = data.publishCallId;
    this.iceServers = data.iceServers;
    this.onGotStream = data.onGotStream;
    this.onGotOffer = data.onGotOffer;
    this.onGotIceCandidate = data.onGotIceCandidate;
  }

  createPeerConnection = async (): Promise<void> => {
    this.peerConnection = new RTCPeerConnection({ iceServers: this.iceServers });
    this.peerConnection.onicecandidate = (e) => e.candidate && this.onGotIceCandidate?.(e.candidate, this.callId);
    this.peerConnection.oniceconnectionstatechange = (e) => console.log(e, '----- ice connection state change -----');

    if (this.type !== ConnectionTypes.Publish) {
      this.peerConnection.ontrack = (e) => {
        this.stream = this.stream || new MediaStream();
        this.stream.addTrack(e.track);
        this.onGotStream?.(this.stream, this.publishCallId);
      };
    }
  };

  generateLocalStream = async (): Promise<void> => {
    this.localStream = await getUserMedia();
    this.onGotStream?.(this.localStream);
  };

  createOffer = async (): Promise<void> => {
    if (this.localStream) {
      this.localStream.getTracks().map((track) => this.peerConnection?.addTrack(track));
    }
    const offer = await this.peerConnection?.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
    if (offer) {
      await this.peerConnection?.setLocalDescription(offer);
      this.onGotOffer?.(offer.sdp, this.callId);
    }
  };

  addAnswer = async (sdp: string): Promise<void> => {
    const answer = new RTCSessionDescription({ type: 'answer', sdp });
    await this.peerConnection?.setRemoteDescription(answer);
    this.sdpAnswerSet = true;
  };

  addIceCandidate = async (candidate: RTCIceCandidate): Promise<void> => {
    await this.peerConnection?.addIceCandidate(new RTCIceCandidate(candidate));
  };

  stop = (): void => {
    this.peerConnection?.close();
  };
}
