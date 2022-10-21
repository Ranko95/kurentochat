import { VideoStream } from "../utils/video-stream/VideoStream";

const videoStreams: Record<string, VideoStream> = {};

const getVideoStream = (callId: string) => {
  return videoStreams[callId];
};

const addVideoStream = (videoStream: VideoStream, callId: string) => {
  videoStreams[callId] = videoStream;
};

const removeVideoStream = (callId: string) => {
  delete videoStreams[callId];
}

export = {
  videoStreams,
  getVideoStream,
  addVideoStream,
  removeVideoStream,
};
