import { Router } from "express";
import { auth } from "../controllers/auth.controller.js";
import { createTask, deleteTask, getTasksByUser } from "../controllers/task.controller.js"
const router = Router();

router.post('/auth', auth);
router.post('/users/:tgId/tasks', createTask);
router.get('/users/:tgId/tasks', getTasksByUser);
router.delete('/users/:tgId/tasks/:id', deleteTask)

export default router;