import { Router } from '../../../services/socket/router';
import * as controller from "./controller";

const router = new Router();

router.addRoute(
  { path: 'publish' },
  controller.publish,
);
router.addRoute(
  { path: 'view' },
  controller.view,
);
router.addRoute(
  { path: 'iceCandidate' },
  controller.iceCandidate,
);

export const connectionRouter = router;
