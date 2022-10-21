import { Socket } from 'socket.io-client';
import socketRequest from 'src/lib/api/socket-request';

interface IResponse {
  error?: string;
  result?: {
    joined: boolean;
  };
}

export const joinConferenceRequest = (socket: Socket): Promise<IResponse> => socketRequest(socket, 'conference:join');
