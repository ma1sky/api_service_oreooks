import { Router } from "express";
import { auth } from "../controllers/auth.controller.js";
import { createTask, getTasksByUser } from "../controllers/task.controller.js";
const router = Router();
router.post('/auth', auth);
router.post('/users/:tgId/tasks', createTask);
router.get('/users/:tgId/tasks', getTasksByUser);
export default router;
//# sourceMappingURL=routes.js.map