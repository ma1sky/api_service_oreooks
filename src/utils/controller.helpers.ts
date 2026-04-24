import type { Response } from 'express'

export function badRequest(res: Response, message: string) {
  return res.status(400).json({
    success: false,
    message
  })
}

export function notFound(res: Response, message: string) {
  return res.status(404).json({
    success: false,
    message
  })
}

export function serverError(res: Response, error: unknown) {
  console.error(error)

  return res.status(500).json({
    success: false,
    message: error instanceof Error ? error.message : 'Ошибка сервера'
  })
}

export function ok(res: Response, data: any) {
  return res.status(200).json({
    success: true,
    ...data
  })
}

export function created(res: Response, data: any) {
  return res.status(201).json({
    success: true,
    ...data
  })
}

export function parseId(value: string): number | null {
  const id = Number(value as string)
  return isNaN(id) ? null : id
}