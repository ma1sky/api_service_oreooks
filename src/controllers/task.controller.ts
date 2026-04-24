import type { Request, Response } from 'express'
import TaskRepository from '../db/task.repository.js'
import {
  badRequest,
  notFound,
  serverError,
  ok,
  created,
  parseId
} from '../utils/controller.helpers.js'

export const getTasksByUser = async (
  req: Request<{ tgId: string }>,
  res: Response
) => {
  try {
    const tgId = Number(req.params.tgId)

    if (!tgId || Number.isNaN(tgId)) {
      return badRequest(res, 'Неверный tgId')
    }

    const tasks = await TaskRepository.getTasksByAuthor(tgId)

    return ok(res, { tasks })
  } catch (error) {
    return serverError(res, error)
  }
}

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, deadline, authorId } = req.body

    if (!title || !deadline || !authorId) {
      return badRequest(res, 'Не хватает обязательных полей')
    }

    const task = await TaskRepository.createTask({
      title,
      description,
      deadline: new Date(deadline),
      authorId
    })

    return created(res, { task })
  } catch (error) {
    return serverError(res, error)
  }
}

export const getTaskById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const id = parseId(req.params.id)

    if (!id) {
      return badRequest(res, 'Неверный ID задачи')
    }

    const task = await TaskRepository.getTaskById(id)

    if (!task) {
      return notFound(res, 'Задача не найдена')
    }

    return ok(res, { task })
  } catch (error) {
    return serverError(res, error)
  }
}

export const updateTask = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const id = parseId(req.params.id)

    if (!id) {
      return badRequest(res, 'Неверный ID задачи')
    }

    const task = await TaskRepository.updateTask(id, req.body)

    return ok(res, { task })
  } catch (error) {
    return serverError(res, error)
  }
}

export const deleteTask = async (
  req: Request<{ tgId: string; id: string }>,
  res: Response
) => {
  try {
    const tgId = parseId(req.params.tgId)
    const id = parseId(req.params.id)

    if (!id || Number.isNaN(id)) {
      return badRequest(res, 'Неверный ID задачи')
    }

    const task = await TaskRepository.getTaskById(id)

    if (!task) {
      return notFound(res, 'Задача не найдена')
    }

    if (task.authorId !== tgId) {
      return badRequest(res, 'Нет доступа к этой задаче')
    }

    const deleted = await TaskRepository.deleteTask(id)

    return ok(res, { task: deleted })
  } catch (error) {
    return serverError(res, error)
  }
}