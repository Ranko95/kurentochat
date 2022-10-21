import { IceCandidate } from "kurento-client";

const candidateQueue: Record<string, IceCandidate[]> = {};

const getQueue = (callId: string) => {
  return candidateQueue[callId];
};

const addCandidateToQueue = (candidate: IceCandidate, callId: string) => {
  candidateQueue[callId] = candidateQueue[callId] || [];
  candidateQueue[callId].push(candidate);
};

const removeQueue = (callId: string) => {
  delete candidateQueue[callId];
}

export = {
  candidateQueue, 
  getQueue,
  addCandidateToQueue,
  removeQueue,
};
