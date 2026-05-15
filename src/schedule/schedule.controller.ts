import type { Request, Response } from 'express';
import { WORKER_LINK } from '../config/env.config';
import { getScheduleByDate as getScheduleFromDb, scheduleExists } from './schedule.repository';

export const getScheduleByDate = async (req: Request, res: Response) => {
  try {
    const { tgId, date } = req.params;
    
    if (!date || typeof date !== 'string') {
      return res.status(400).json({ message: "Дата обязательна" });
    }
    
    const tgIdNum = Number(tgId);
    
    if (isNaN(tgIdNum)) {
      return res.status(400).json({ message: "Некорректный tgId" });
    }

    // Parse date string (expected format YYYY-MM-DD)
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Некорректный формат даты" });
    }

    // First, check if schedule exists in database for this user
    const exists = await scheduleExists(tgIdNum);
    if (exists) {
      const schedule = await getScheduleFromDb(tgIdNum, parsedDate);
      if (schedule) {
        return res.json(schedule);
      }
      // If schedule exists but not for this specific date, we can still fall back to worker
    }

    // If no schedule in DB, proxy to worker service
    if (!WORKER_LINK) {
      console.error('WORKER_LINK is not defined');
      return res.status(500).json({ message: "Worker service configuration missing" });
    }
    
    let workerBase = WORKER_LINK.trim();
    if (!workerBase.startsWith('http://') && !workerBase.startsWith('https://')) {
      workerBase = `http://${workerBase}`;
      console.warn(`WORKER_LINK missing protocol, defaulting to: ${workerBase}`);
    }
    
    const workerUrl = `${workerBase}/api/users/${tgId}/schedule/${date}`;
    console.log(`Proxying schedule request to: ${workerUrl}`);
    
    const response = await fetch(workerUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Worker service responded with ${response.status}: ${errorText}`);
      return res.status(response.status).json({
        message: `Worker service error: ${errorText.substring(0, 200)}`
      });
    }
    
    const data = await response.json();
    return res.json(data);
  } catch (error) {
    console.error('Error processing schedule request:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      message: "Internal server error",
      detail: errorMessage
    });
  }
};