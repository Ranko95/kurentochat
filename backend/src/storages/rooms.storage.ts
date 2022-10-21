import { DEFAULT_ROOM_NAME } from "../consts/video-chat.constants";
import { Room } from "../utils/room/Room";

const rooms: Room[] = [new Room({ name: DEFAULT_ROOM_NAME })];

const getRoom = (name: string) => {
  return rooms.find((r) => r.name === name);
};

export = {
  rooms,
  getRoom,
};
