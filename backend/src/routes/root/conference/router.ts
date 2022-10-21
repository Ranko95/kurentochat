import { Router } from '../../../services/socket/router';
import * as controller from "./controller";

const router = new Router();

router.addRoute(
  { path: 'join' },
  controller.join,
);

export const conferenceRouter = router;
