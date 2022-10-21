import { logger } from '../config/logger';
import { startSocket } from './startSocket';

export const runBootTasks = async () => {
    logger.info('BootTasks:running:start');
    await startSocket();
    logger.info('BootTasks:running:complete');
};
