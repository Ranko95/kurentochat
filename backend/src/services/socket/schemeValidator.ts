import { Socket, Server } from 'socket.io';
import { Schema } from 'joi';

export const schemeValidator = (scheme: Schema) => (
    async (io: Server, socket: Socket, data: any) => {
        const result = scheme.validate(data);

        if (result.error) {
            throw result.error;
        }
    }
);
