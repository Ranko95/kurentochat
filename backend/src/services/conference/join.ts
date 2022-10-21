import { DEFAULT_ROOM_NAME, MAX_USER_AMOUNT } from "../../consts/video-chat.constants";
import roomsStorage from "../../storages/rooms.storage";
import { User, UserDTO } from "../../utils/user/User";

interface IResult {
  joined: boolean;
  roomState: UserDTO[];
}

export const join = async (userId: string): Promise<IResult> => {
  const room = roomsStorage.getRoom(DEFAULT_ROOM_NAME);
  if (!room) {
    throw new Error("Room doesn't exist");
  }

  const usersInRoom = room.users.length;
  if (usersInRoom >= MAX_USER_AMOUNT) {
    throw new Error("Maximum participant amount exceeded");
  }

  const user = new User({ id: userId });
  room.addUser(user);

  const roomState = room.getState();

  return {
    joined: true,
    roomState,
  }
};
