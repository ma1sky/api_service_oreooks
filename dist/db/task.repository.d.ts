import { Prisma } from '@prisma/client';
import type { TaskResponseDto } from '../config/types.js';
declare class TaskRepository {
    createTask(data: Prisma.TaskUncheckedCreateInput): Promise<TaskResponseDto>;
    getTaskById(id: number): Promise<TaskResponseDto | null>;
    getTasksByAuthor(authorId: number): Promise<TaskResponseDto[]>;
    updateTask(id: number, data: Prisma.TaskUpdateInput): Promise<TaskResponseDto>;
    deleteTask(id: number): Promise<TaskResponseDto>;
}
declare const _default: TaskRepository;
export default _default;
//# sourceMappingURL=task.repository.d.ts.map