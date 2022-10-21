import { IceCandidate } from "kurento-client";
import candidateQueueStorage from "../../storages/iceCandidateQueue.storage";
import videoStreamsStorage from "../../storages/videoStreams.storage";

export const iceCandidate = async (data: { candidate: IceCandidate, callId: string }): Promise<void> => {
  const { candidate, callId } = data;
  const videoStream = videoStreamsStorage.getVideoStream(callId);
  if (videoStream) {
    await videoStream.addCandidate(candidate);
  }

  candidateQueueStorage.addCandidateToQueue(candidate, callId);
};
