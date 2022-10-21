import { Socket } from "socket.io";
import candidateQueueStorage from "../../storages/iceCandidateQueue.storage";
import videoStreamsStorage from "../../storages/videoStreams.storage";
import Kurento from "../kurento/Kurento";
import { VideoStream } from "./VideoStream";

export const createUserStream = async (socket: Socket, data: { callId: string, sdp: string, connectedToUser?: string }) => {
  const { callId, sdp, connectedToUser } = data;

  const endpoint = await Kurento.createWebRTCEndpoint();

  const videoStream = new VideoStream({
    userId: socket.id,
    callId: callId,
    endpoint,
    connectedToUser,
    onIceCandidate: (candidate) => socket.emit('connection:iceCandidate', { candidate, callId }),
  }); 

  await videoStream.configureEndpoint();

  videoStreamsStorage.addVideoStream(videoStream, callId);
  
  const queue = candidateQueueStorage.getQueue(callId);
  if (queue) {
    await videoStream.addCandidates(queue);
    candidateQueueStorage.removeQueue(callId);
  }

  const answer = await videoStream.processOffer(sdp);
  await videoStream.gatherIceCandidates();

  return { videoStream, answer };
};
