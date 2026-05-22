import { Router } from "express";
import { auth } from "../auth/auth.controller";
import { createTask, deleteTask, getTasksByUser, updateTask, getTaskById } from "../tasks/task.controller"
import { getScheduleByDate, getEventsByDate } from '../orioks/orioks.controller'
const router = Router();

router.post('/auth', auth);

router.post('/users/:tgId/tasks', createTask);
router.get('/users/:tgId/tasks', getTasksByUser);

router.delete('/users/:tgId/tasks/:id', deleteTask);
router.put('/users/:tgId/tasks/:id', updateTask);
router.get('/users/:tgId/tasks/:id', getTaskById);

router.get('/users/:tgId/schedule/:date', getScheduleByDate);
router.get('/users/:tgId/events/:date', getEventsByDate);

export default router;