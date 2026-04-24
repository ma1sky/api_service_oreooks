import { Router } from "express";
import { auth } from "../controllers/auth.controller.js";
import { createTask } from "../controllers/task.controller.js"
const router = Router();

router.post('/auth', auth);
router.post('/users/:tgId/tasks', createTask);

export default router;