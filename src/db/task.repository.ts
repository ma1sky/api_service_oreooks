import prisma from './prisma.js'
import { Prisma } from '@prisma/client'
import type { TaskResponseDto } from '../config/types.js'


function toTaskDto(task: {
    id: number
    title: string
    description: string
    deadline: Date
    authorId: number
}): TaskResponseDto {
    return {
        id: task.id,
        title: task.title,
        description: task.description,
        deadline: task.deadline,
        authorId: task.authorId
    }
}

class TaskRepository {
    async createTask(data: Prisma.TaskUncheckedCreateInput) {
    return toTaskDto(await prisma.task.create({
        data
    }))
}
    async getTaskById(id: number): Promise<TaskResponseDto | null> {
        const task = await prisma.task.findUnique({
            where: { id }
        })

        if (!task) return null

        return toTaskDto(task)
    }

    async getTasksByAuthor(authorId: number): Promise<TaskResponseDto[]> {
        const tasks = await prisma.task.findMany({
            where: { authorId },
            orderBy: { deadline: 'asc' }
        })

        return tasks.map(toTaskDto)
    }

    async updateTask(
        id: number,
        data: Prisma.TaskUpdateInput
    ): Promise<TaskResponseDto> {
        const task = await prisma.task.update({
            where: { id },
            data
        })

        return toTaskDto(task)
    }

    async deleteTask(id: number): Promise<TaskResponseDto | null> {
    const task = await prisma.task.findUnique({
      where: { id }
    })

    if (!task) return null

    const deleted = await prisma.task.delete({
      where: { id }
    })

    return toTaskDto(deleted)
  }
}

export default new TaskRepository()