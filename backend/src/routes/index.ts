import { Router } from '../services/socket/router';
import { conferenceRouter } from "./root/conference/router";
import { connectionRouter } from "./root/connection/router";

const router = new Router();

router.addRouter('conference', conferenceRouter);
router.addRouter('connection', connectionRouter);

export const rootRouter = router;
