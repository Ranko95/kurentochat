import { Socket } from "socket.io";
import { DEFAULT_ROOM_NAME } from "../../consts/video-chat.constants";
import roomsStorage from "../../storages/rooms.storage";

export const configureSocket = (socket: Socket) => {
  socket.on('disconnect', async () => {
    const room = roomsStorage.getRoom(DEFAULT_ROOM_NAME);
    if (room) {
      const user = room.getUser(socket.id);
      if (user) {
        await user.stopAllStreams();
        await room.removeUser(socket.id);
      }

      socket.to(DEFAULT_ROOM_NAME).emit('conference:state', room.getState());
    }
  });
};
