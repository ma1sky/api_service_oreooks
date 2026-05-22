import { Request, Response } from "express";
import orioksApi from "./orioks.service";
import * as repo from "./orioks.repository";
import prisma from "../db/prisma";
import userRepository from "../auth/auth.repository";
import {
  ok,
  badRequest,
  notFound,
  serverError,
} from "../utils/controller.helpers";

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

    // 1. Get user token
    const user = await userRepository.getUser(tgId);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    // 2. Get student to find groupId
    const student = await prisma.student.findFirst({
      where: { userId: tgId },
      include: { group: true },
    });

    let groupId: number | null = null;
    if (student?.groupId) {
      groupId = student.groupId;
    } else if (student?.groupName) {
      // Try to find group by name
      const group = await prisma.group.findFirst({
        where: { name: student.groupName },
      });
      if (group) {
        groupId = group.id;
        // Update student with groupId
        await prisma.student.update({
          where: { id: student.id },
          data: { groupId: group.id },
        });
      }
    }

    if (!groupId) {
      // If no group info, fetch student data from API to get group
      try {
        const studentData = await orioksApi.getStudent(user.token);
        await repo.saveStudent(tgId, studentData);

        // Fetch groups to find matching group
        const groups = await orioksApi.getGroups(user.token);
        const group = groups.find((g) => g.name === studentData.group);
        if (group) {
          // Save group if not exists
          const savedGroup = await prisma.group.upsert({
            where: { orioksId: group.id },
            update: { name: group.name },
            create: { orioksId: group.id, name: group.name },
          });
          groupId = savedGroup.id;

          // Update student with groupId
          await prisma.student.update({
            where: { userId: tgId },
            data: { groupId: savedGroup.id },
          });
        }
      } catch (apiError) {
        console.error("Failed to fetch student/group data:", apiError);
        return res
          .status(503)
          .json({ message: "Не удалось получить данные группы" });
      }
    }

    if (!groupId) {
      return res.status(404).json({ message: "Группа не найдена" });
    }

    // 3. пробуем БД
    let schedule = await repo.getScheduleByDate(date, groupId);

    // 4. если пусто → идём в ORIOKS
    if (!schedule || schedule.length === 0) {
      try {
        const groupSchedule = await orioksApi.getGroupSchedule(
          user.token,
          groupId,
        );
        // TODO: Implement saveSchedule function
        console.log(
          "Fetched schedule from API, but save not implemented",
          groupSchedule,
        );
        // For now, return empty schedule
        schedule = [];
      } catch (apiError) {
        console.error("Failed to fetch schedule from API:", apiError);
        return serverError(res, "Не удалось получить расписание");
      }
    }

    return ok(res, { schedule });
  } catch (error) {
    console.error(error);
    return serverError(res, error);
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
      return badRequest(res, "Неверные параметры запроса");
    }

    // 1. Get user token
    const user = await userRepository.getUser(tgId);
    if (!user) {
      return notFound(res, "Пользователь не найден");
    }

    // 2. Get student to find studentId (primary key of Student model)
    const student = await prisma.student.findFirst({
      where: { userId: tgId },
    });

    let studentId: number | null = student?.id || null;

    if (!studentId) {
      // If no student record, fetch student data from API and save
      try {
        const studentData = await orioksApi.getStudent(user.token);
        await repo.saveStudent(tgId, studentData);
        // Refetch student to get ID
        const updatedStudent = await prisma.student.findFirst({
          where: { userId: tgId },
        });
        studentId = updatedStudent?.id || null;
      } catch (apiError) {
        console.error("Failed to fetch student data:", apiError);
        return serverError(res, "Не удалось получить данные студента");
      }
    }

    if (!studentId) {
      return notFound(res, "Студент не найден");
    }

    // 3. пробуем БД
    let events = await repo.getEventsByDate(date, studentId);

    // 4. если пусто → идём в ORIOKS
    if (!events || events.length === 0) {
      try {
        // Fetch disciplines
        const disciplines = await orioksApi.getDisciplines(user.token);
        await repo.saveDisciplines(studentId, disciplines);

        // Fetch events for each discipline
        for (const discipline of disciplines) {
          const disciplineEvents = await orioksApi.getDisciplineEvents(
            user.token,
            discipline.id,
          );
          // Find discipline ID in DB
          const dbDiscipline = await prisma.discipline.findFirst({
            where: { orioksId: discipline.id, studentId },
          });
          if (dbDiscipline) {
            await repo.saveEvents(dbDiscipline.id, disciplineEvents);
          }
        }

        // Refetch events from DB
        events = await repo.getEventsByDate(date, studentId);
      } catch (apiError) {
        console.error("Failed to fetch events from API:", apiError);
        return serverError(res, "Не удалось получить события");
      }
    }

    return ok(res, { events });
  } catch (error) {
    console.error(error);
    return serverError(res, error);
  }
};
