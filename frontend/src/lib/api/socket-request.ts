import { Socket } from 'socket.io-client';

const Request = (socket: Socket, event: string, data?: any): Promise<any> =>
  new Promise((resolve) => {
    socket.emit(event, data, (response: any) => resolve(response));
  });

export default Request;
