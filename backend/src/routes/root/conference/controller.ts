import { IRouteFn } from '../../../../types/socket';
import { DEFAULT_ROOM_NAME } from '../../../consts/video-chat.constants';
import { join as joinService } from "../../../services/conference/join";

export const join: IRouteFn = async (io, socket, data) => {
  const { joined, roomState } = await joinService(socket.id);

  socket.join(DEFAULT_ROOM_NAME);
  io.to(DEFAULT_ROOM_NAME).emit('conference:state', roomState);

  return {
    joined,
  };
};
