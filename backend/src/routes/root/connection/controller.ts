import { IRouteFn } from '../../../../types/socket';
import { DEFAULT_ROOM_NAME } from '../../../consts/video-chat.constants';
import { videoStream as videoStreamService } from "../../../services/connection/videoStream";
import { iceCandidate as iceCandidateService } from "../../../services/connection/iceCandidate";
import videoStreamsStorage from '../../../storages/videoStreams.storage';
import roomsStorage from '../../../storages/rooms.storage';

export const publish: IRouteFn = async (io, socket, data) => {
  const { sdp, callId } = data;

  const room = roomsStorage.getRoom(DEFAULT_ROOM_NAME);
  if (!room) {
    throw new Error('Room doesn`t exist');
  }

  const user = room.getUser(socket.id);
  if (!user) {
    throw new Error('User doesn`t exist');
  }

  const { videoStream, answer } = await videoStreamService(socket, { sdp, callId });

  user.addPublishStream(videoStream);

  const roomState = room.getState();
  socket.to(DEFAULT_ROOM_NAME).emit('conference:state', roomState);

  return { answer };
};

export const view: IRouteFn = async (io, socket, data) => {
  const { sdp, callId, publishCallId } = data;
  const publishStream = videoStreamsStorage.getVideoStream(publishCallId);
  if (!publishStream) {
    throw new Error('Invalid call id');
  }

  const room = roomsStorage.getRoom(DEFAULT_ROOM_NAME);
  if (!room) {
    throw new Error('Room doesn`t exist');
  }

  const user = room.getUser(socket.id);
  if (!user) {
    throw new Error('User doesn`t exist');
  }

  const { videoStream, answer } = await videoStreamService(socket, { sdp, callId, connectedToUser: publishStream.userId });

  user.addViewStream(videoStream);

  await publishStream.endpoint.connect(videoStream.endpoint);

  return { answer };
};

export const iceCandidate: IRouteFn = async (io, socket, data) => {
  await iceCandidateService(data);
};
