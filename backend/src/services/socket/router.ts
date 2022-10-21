import { Socket, Server } from 'socket.io';
import { ICbFn, IRouteFn } from '../../../types/socket';
import { emptyFunction } from '../../utils/function/emptyFunction';

export class Router {
    private routes: {
        path: string;
        log: boolean;
        disconnectOnError: boolean;
        fns: IRouteFn[];
    }[];

    private routers: {
        path: string;
        router: Router;
    }[];

    constructor() {
        this.routes = [];
        this.routers = [];
    }

    addRoute({
        path,
        log = false,
        disconnectOnError = false,
    }: {
        path: string;
        log?: boolean;
        disconnectOnError?: boolean;
    }, ...fns: IRouteFn[]) {
        this.routes.push({
            path,
            log,
            fns,
            disconnectOnError,
        });
    }

    addRouter(path: string, router: Router) {
        this.routers.push({
            path,
            router,
        });
    }

    subscribe(io: Server, socket: Socket, { path }: { path?: string } = {}) {
        this.routes.map((r) => {
            const p = path?.length ? `${path}:${r.path}` : r.path;
            socket.on(p, async (data: any, cb: ICbFn = emptyFunction) => {
                try {
                    let res;
                    for (let i = 0; i < r.fns.length; i++) {
                        // eslint-disable-next-line no-await-in-loop
                        res = await r.fns[i](io, socket, data);
                    }
                    cb({ result: res });
                } catch (e) {
                    if (r.disconnectOnError) {
                        socket.disconnect();
                    } else {
                        cb({ error: e.message });
                    }
                }
            });
        });
        this.routers.map((r) => {
            r.router.subscribe(io, socket, { path: r.path });
        });
    }
}
