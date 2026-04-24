import prisma from './prisma.js';
import { Prisma } from '@prisma/client';
function toTaskDto(task) {
    return {
        id: task.id,
        title: task.title,
        description: task.description,
        deadline: task.deadline,
        authorId: task.authorId
    };
}
class TaskRepository {
    async createTask(data) {
        return toTaskDto(await prisma.task.create({
            data
        }));
    }
    async getTaskById(id) {
        const task = await prisma.task.findUnique({
            where: { id }
        });
        if (!task)
            return null;
        return toTaskDto(task);
    }
    async getTasksByAuthor(authorId) {
        const tasks = await prisma.task.findMany({
            where: { authorId },
            orderBy: { deadline: 'asc' }
        });
        return tasks.map(toTaskDto);
    }
    async updateTask(id, data) {
        const task = await prisma.task.update({
            where: { id },
            data
        });
        return toTaskDto(task);
    }
    async deleteTask(id) {
        const task = await prisma.task.findUnique({
            where: { id }
        });
        if (!task)
            return null;
        const deleted = await prisma.task.delete({
            where: { id }
        });
        return toTaskDto(deleted);
    }
}
export default new TaskRepository();
//# sourceMappingURL=task.repository.js.map