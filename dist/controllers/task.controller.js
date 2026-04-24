import TaskRepository from '../db/task.repository.js';
import { badRequest, notFound, serverError, ok, created, parseId } from '../utils/controller.helpers.js';
export const createTask = async (req, res) => {
    try {
        const { title, description, deadline, authorId } = req.body;
        if (!title || !deadline || !authorId) {
            return badRequest(res, 'Не хватает обязательных полей');
        }
        const task = await TaskRepository.createTask({
            title,
            description,
            deadline: new Date(deadline),
            authorId
        });
        return created(res, { task });
    }
    catch (error) {
        return serverError(res, error);
    }
};
export const getTaskById = async (req, res) => {
    try {
        const id = parseId(req.params.id);
        if (!id) {
            return badRequest(res, 'Неверный ID задачи');
        }
        const task = await TaskRepository.getTaskById(id);
        if (!task) {
            return notFound(res, 'Задача не найдена');
        }
        return ok(res, { task });
    }
    catch (error) {
        return serverError(res, error);
    }
};
export const getTasksByAuthor = async (req, res) => {
    try {
        const authorId = parseId(req.params.authorId);
        if (!authorId) {
            return badRequest(res, 'Неверный authorId');
        }
        const tasks = await TaskRepository.getTasksByAuthor(authorId);
        return ok(res, { tasks });
    }
    catch (error) {
        return serverError(res, error);
    }
};
export const updateTask = async (req, res) => {
    try {
        const id = parseId(req.params.id);
        if (!id) {
            return badRequest(res, 'Неверный ID задачи');
        }
        const task = await TaskRepository.updateTask(id, req.body);
        return ok(res, { task });
    }
    catch (error) {
        return serverError(res, error);
    }
};
export const deleteTask = async (req, res) => {
    try {
        const id = parseId(req.params.id);
        if (!id) {
            return badRequest(res, 'Неверный ID задачи');
        }
        const task = await TaskRepository.deleteTask(id);
        return ok(res, { task });
    }
    catch (error) {
        return serverError(res, error);
    }
};
//# sourceMappingURL=task.controller.js.map