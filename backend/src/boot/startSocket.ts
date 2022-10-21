import { vars } from '../config/vars';
import { io } from '../config/socket';
import { logger } from '../config/logger';

export const startSocket = () => {
    logger.info('socket:running:start');
    io.listen(vars.port);
    logger.info(`socket:running:complete; started on port: ${vars.port}`);
};
