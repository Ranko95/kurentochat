import { Socket } from 'socket.io-client';
import socketRequest from 'src/lib/api/socket-request';

interface IResponse {
  error?: string;
  result?: {
    answer: string;
  };
}

export const transferPublishConnectionOfferRequest = (
  socket: Socket,
  data: { sdp: string | undefined; callId: string },
): Promise<IResponse> => socketRequest(socket, 'connection:publish', data);
