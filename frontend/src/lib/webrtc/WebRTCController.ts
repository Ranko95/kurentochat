import { ConnectionTypes, IWebRTCConnectionData, WebRTCConnection } from './WebRTCConnection';

interface IConnectionData extends Omit<IWebRTCConnectionData, 'type'> {}

class WebRTCController {
  connections: Record<string, WebRTCConnection> = {};
  iceCandidateQueue: Record<string, RTCIceCandidate[]> = {};

  createPublishConnection = async (data: IConnectionData): Promise<void> => {
    try {
      const connection = new WebRTCConnection({ ...data, type: ConnectionTypes.Publish });

      await connection.generateLocalStream();
      await connection.createPeerConnection();
      await connection.createOffer();

      this.connections[connection.callId] = connection;
    } catch (e) {
      console.log(e);
    }
  };

  createViewConnection = async (data: IConnectionData): Promise<void> => {
    const connection = new WebRTCConnection({ ...data, type: ConnectionTypes.View });

    await connection.createPeerConnection();
    await connection.createOffer();

    this.connections[connection.callId] = connection;
  };

  processAnswer = async (sdp: string, callId: string): Promise<void> => {
    const connection = this.connections[callId];

    if (connection) {
      await connection.addAnswer(sdp);
      const queue = this.iceCandidateQueue[callId];
      if (queue) {
        console.log(queue, '----- flush candidates -----');
        for (const candidate of queue) {
          await connection.addIceCandidate(candidate);
        }
        delete this.iceCandidateQueue[callId];
      }
    }
  };

  processIceCandidate = async (candidate: RTCIceCandidate, callId: string): Promise<void> => {
    const connection = this.connections[callId];
    if (connection && connection.sdpAnswerSet) {
      return connection.addIceCandidate(candidate);
    }

    this.iceCandidateQueue[callId] = this.iceCandidateQueue[callId] || [];
    this.iceCandidateQueue[callId].push(candidate);
    console.log(this.iceCandidateQueue[callId], candidate, '----- push candidates to a the queue -----');
  };

  stopConnection = (callId: string): void => {
    const connection = this.connections[callId];

    if (!connection) {
      return;
    }

    connection.stop();

    delete this.connections[callId];
  };
}

export default new WebRTCController();
