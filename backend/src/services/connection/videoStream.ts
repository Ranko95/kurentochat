import { Socket } from "socket.io";
import { createUserStream } from "../../utils/video-stream/factory";
import { VideoStream } from "../../utils/video-stream/VideoStream";

interface IResult {
  videoStream: VideoStream;
  answer: string;
}

export const videoStream = async (socket: Socket, data: { sdp: string, callId: string, connectedToUser?: string }): Promise<IResult> => {
  const { sdp, callId, connectedToUser } = data;
  const result = await createUserStream(socket, { sdp, callId, connectedToUser });

  return result;
};
