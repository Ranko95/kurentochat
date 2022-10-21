import dotenv from 'dotenv';
import { parseBoolean } from '../utils/parsers/parseBoolean';
import { parseNumber } from '../utils/parsers/parseNumber';
import { parseString } from '../utils/parsers/parseString';

dotenv.config();

export const vars = Object.freeze({
    env: parseString(process.env.NODE_ENV, 'develop'),
    logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
    isLocal: parseBoolean(process.env.IS_LOCAL, false),
    port: parseNumber(process.env.PORT, 5000),
    kurentoUrl: parseString(process.env.KURENTO_URL, 'ws://kms:8888/kurento'),
    turnUrl: parseString(process.env.TURN_URL, 'username:password@turn:3478'),
});
