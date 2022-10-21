import { User } from "../user/User";

export class Room {
  name: string;
  users: User[] = [];

  constructor(data: { name: string }) {
    this.name = data.name;
  }

  addUser = (user: User): void => {
    this.users.push(user);
  };

  removeUser = async (id: string): Promise<void> => {
    const userToRemove = this.users.find((u) => u.id === id);
    if (userToRemove) {
      await userToRemove.stopAllStreams();
      this.users = this.users.filter((u) => u.id !== id);
      for (const user of this.users) {
        user.removeStreamForDisconnectedUser(id);
      }
    }
  };

  getUser = (id: string): User | undefined => {
    return this.users.find((u) => u.id === id);
  };

  getState = () => {
    return this.users.map((u) => u.toDTO());
  };
}
