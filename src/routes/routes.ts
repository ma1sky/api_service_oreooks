import { Router } from "express";
import { auth } from "../auth/auth.controller";
import { createTask, deleteTask, getTasksByUser, updateTask } from "../tasks/task.controller"
const router = Router();

router.post('/auth', auth);
router.post('/users/:tgId/tasks', createTask);
router.get('/users/:tgId/tasks', getTasksByUser);
router.delete('/users/:tgId/tasks/:id', deleteTask);
router.put('/users/:tgId/tasks/:id', updateTask);

export default router;