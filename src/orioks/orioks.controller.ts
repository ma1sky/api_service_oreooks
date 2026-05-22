import { Request, Response } from "express";
import orioksApi from "../api/orioksApiService";
import * as repo from "./orioks.repository";

/**
 * =========================
 * SCHEDULE BY DATE
 * =========================
 */
export const getScheduleByDate = async (
  req: Request<{ tgId: string; date: string }>,
  res: Response,
) => {
  try {
    const tgId = Number(req.params.tgId);
    const date = new Date(req.params.date);

    if (isNaN(tgId) || isNaN(date.getTime())) {
      return res.status(400).json({ message: "Неверные параметры запроса" });
    }

    // 1. пробуем БД
    let schedule = await repo.getScheduleByDate(date, tgId);

    // 2. если пусто → идём в ORIOKS
    
    return res.status(200).json({ schedule });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

/**
 * =========================
 * EVENTS BY DATE
 * =========================
 */
export const getEventsByDate = async (
  req: Request<{ tgId: string; date: string }>,
  res: Response,
) => {
  try {
    const tgId = Number(req.params.tgId);
    const date = new Date(req.params.date);

    if (isNaN(tgId) || isNaN(date.getTime())) {
      return res.status(400).json({ message: "Неверные параметры запроса" });
    }

    // 1. пробуем БД
    let events = await repo.getEventsByDate(date, tgId);

    // 2. если пусто → идём в ORIOKS
    

    return res.status(200).json({ events });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};