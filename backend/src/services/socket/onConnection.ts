import { Socket, Server } from 'socket.io';
import { rootRouter } from '../../routes';
import { logger } from '../../config/logger';

export const onConnection = (io: Server, socket: Socket) => {
    logger.info(`socket:connected; ${socket}`);
    rootRouter.subscribe(io, socket);
};
