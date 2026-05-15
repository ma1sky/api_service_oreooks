import prisma from '../db/prisma';
import { Day } from '@prisma/client';

const getGroupIdByTgId = async (tgId: number): Promise<number | null> => {
  const student = await prisma.student.findFirst({
    where: { userId: tgId },
    select: { groupId: true },
  });

  return student?.groupId ?? null;
};

const dateToDayOfWeek = (date: Date): Day => {
  const day = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const days: Day[] = [
    Day.Monday,    // 0
    Day.Tuesday,   // 1
    Day.Wednesday, // 2
    Day.Thursday,  // 3
    Day.Friday,    // 4
    Day.Saturday,  // 5
    Day.Sunday,    // 6
  ];
  // Map JavaScript day to our array index
  const index = day === 0 ? 6 : day - 1;
  if (index < 0 || index >= days.length) {
    // fallback to Monday (should never happen)
    return Day.Monday;
  }
  return days[index] as Day;
};

export const getScheduleByDate = async (
  tgId: number,
  date: Date
) => {
  const groupId = await getGroupIdByTgId(tgId);
  if (!groupId) {
    return null;
  }

  const dayOfWeek = dateToDayOfWeek(date);

  // For now, we don't have weekType, so we'll return the first schedule for this day.
  // This is a temporary solution.
  const schedule = await prisma.schedule.findFirst({
    where: { groupId, dayOfWeek },
    include: {
      lessons: {
        orderBy: { lesson_number: 'asc' },
      },
    },
  });

  return schedule;
};

export const scheduleExists = async (tgId: number): Promise<boolean> => {
  const groupId = await getGroupIdByTgId(tgId);
  if (!groupId) {
    return false;
  }

  const schedule = await prisma.schedule.findFirst({
    where: { groupId },
    select: { id: true },
  });

  return !!schedule;
};