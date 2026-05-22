import prisma from "../db/prisma";
import { Prisma } from "@prisma/client";
import type { TaskResponseDto } from "../config/types";

function toTaskDto(task: {
  id: number;
  title: string;
  description: string;
  deadline: Date | null;
  authorId: number;
  state?: string;
}): TaskResponseDto {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    deadline: task.deadline,
    authorId: task.authorId,
    state: task.state || "draft",
  };
}

class TaskRepository {
  async createTask(data: Prisma.TaskUncheckedCreateInput) {
    return toTaskDto(
      await prisma.task.create({
        data,
      }),
    );
  }
  async getTaskById(id: number): Promise<TaskResponseDto | null> {
    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) return null;

    return toTaskDto(task);
  }

  async getTasksByTgId(tgId: number): Promise<TaskResponseDto[]> {
    const tasks = await prisma.task.findMany({
      where: { authorId: tgId },
      orderBy: { deadline: "asc" },
      select: {
        id: true,
        title: true,
        description: true,
        deadline: true,
        authorId: true,
        state: true, //it exists in the database and default value is 'draft'
      },
    });

    return tasks.map(toTaskDto);
  }

  async updateTask(
    id: number,
    data: Prisma.TaskUpdateInput,
  ): Promise<TaskResponseDto> {
    const task = await prisma.task.update({
      where: { id },
      data,
    });

    return toTaskDto(task);
  }

  async deleteTask(id: number): Promise<TaskResponseDto | null> {
    const task = await prisma.task.findUnique({
      where: { id },
    });
    console.log(id);

    if (!task) return null;

    const deleted = await prisma.task.delete({
      where: { id },
    });

    return toTaskDto(deleted);
  }
}

export default new TaskRepository();
