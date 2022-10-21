import { Socket } from 'socket.io-client';
import socketRequest from 'src/lib/api/socket-request';

interface IResponse {
  error?: string;
  result?: undefined;
}

export const transferIceCandidateRequest = (
  socket: Socket,
  data: { candidate: RTCIceCandidate; callId: string },
): Promise<IResponse> => socketRequest(socket, 'connection:iceCandidate', data);
