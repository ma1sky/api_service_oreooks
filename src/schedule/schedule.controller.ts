import type { Request, Response } from 'express';
import { WORKER_LINK } from '../config/env.config';

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
    
    if (!WORKER_LINK) {
      console.error('WORKER_LINK is not defined');
      return res.status(500).json({ message: "Worker service configuration missing" });
    }
    
    const workerUrl = `${WORKER_LINK}/users/${tgId}/schedule/${date}`;
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
    console.error('Error proxying schedule request:', error);
    // Возвращаем более детальное сообщение для отладки
    const errorMessage = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      message: "Internal server error",
      detail: errorMessage
    });
  }
};