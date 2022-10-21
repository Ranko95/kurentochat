import { Socket } from 'socket.io-client';
import socketRequest from 'src/lib/api/socket-request';

interface IResponse {
  error?: string;
  result?: {
    answer: string;
  };
}

export const transferViewConnectionOfferRequest = (
  socket: Socket,
  data: { sdp: string | undefined; callId: string; publishCallId: string },
): Promise<IResponse> => socketRequest(socket, 'connection:view', data);
