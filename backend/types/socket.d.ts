import { ExtendedError } from 'socket.io/dist/namespace';
import { Socket, Server } from 'socket.io';

export type INextFn = (err?: ExtendedError) => void;
export type ICbFn = (response: { error?: string, code?: number, result?: any} = {}) => void;
export type IRouteFn = (io: Server, socket: Socket, data: any) => Promise<any>;
