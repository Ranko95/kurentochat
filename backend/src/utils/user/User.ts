import videoStreamsStorage from "../../storages/videoStreams.storage";
import { VideoStream } from "../video-stream/VideoStream";

export interface UserDTO {
  id: string;
  publishStream: string | undefined;
  viewStreams: string[];
}

export class User {
  id: string;
  publishStream: VideoStream | null = null;
  viewStreams: VideoStream[] = [];

  constructor(data: { id: string }) {
    this.id = data.id;
  }

  addPublishStream = (stream: VideoStream): void => {
    this.publishStream = stream;
  };

  addViewStream = (stream: VideoStream): void => {
    this.viewStreams.push(stream);
  };

  stopAllStreams = async (): Promise<void> => {
    const allStreams = [this.publishStream, ...this.viewStreams].filter(Boolean) as VideoStream[];

    for (const stream of allStreams) {
      await stream.stop();
      videoStreamsStorage.removeVideoStream(stream.callId);
    }
  };

  removeStreamForDisconnectedUser = (id: string): void => {
    this.viewStreams = this.viewStreams.filter((s) => s.connectedToUser !== id);
  };

  toDTO = (): UserDTO => {
    return {
      id: this.id,
      publishStream: this.publishStream?.callId,
      viewStreams: this.viewStreams.map((s) => s.callId),
    };
  };
}
