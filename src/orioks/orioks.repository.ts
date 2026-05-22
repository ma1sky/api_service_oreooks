import prisma from "../db/prisma";
import {
  validateStudent,
  validateSemesterInfo,
  validateTimetable,
  validateDisciplines,
  validateEvents,
} from "../db/zod.validators";

/**
 * =========================
 * STUDENT
 * =========================
 */
export async function saveStudent(userId: number, raw: unknown) {
  const student = validateStudent(raw);

  return prisma.student.upsert({
    where: { userId },
    update: {
      course: student.course,
      department: student.department,
      fullName: student.full_name,
      groupName: student.group,
      recordBookId: student.record_book_id,
      semester: student.semester,
      studyDirection: student.study_direction,
      studyProfile: student.study_profile,
      year: student.year,
    },
    create: {
      userId,
      course: student.course,
      department: student.department,
      fullName: student.full_name,
      groupName: student.group,
      recordBookId: student.record_book_id,
      semester: student.semester,
      studyDirection: student.study_direction,
      studyProfile: student.study_profile,
      year: student.year,
    },
  });
}

/**
 * =========================
 * SEMESTER INFO
 * =========================
 */
export async function saveSemesterInfo(raw: unknown) {
  const data = validateSemesterInfo(raw);

  return prisma.semesterInfo.create({
    data: {
      semesterStart: data.semesterStart ?? new Date(0),
      sessionStart: data.sessionStart ?? null,
      sessionEnd: data.sessionEnd ?? null,
      nextSemesterStart: data.nextSemesterStart ?? null,
    },
  });
}

/**
 * =========================
 * TIMETABLE
 * =========================
 */
export async function saveTimetable(raw: unknown) {
  const data = validateTimetable(raw);

  return prisma.timetable.createMany({
    data: data.map((t) => ({
      lessonNumber: t.lessonNumber,
      startTime: t.startTime,
      endTime: t.endTime,
    })),
    skipDuplicates: true,
  });
}

/**
 * =========================
 * DISCIPLINES
 * =========================
 */
export async function saveDisciplines(studentId: number, raw: unknown) {
  const disciplines = validateDisciplines(raw);

  return prisma.discipline.createMany({
    data: disciplines.map((d) => ({
      orioksId: d.orioksId,
      name: d.name,
      department: d.department,
      controlForm: d.controlForm ?? null,
      currentGrade: d.currentGrade ?? null,
      maxGrade: d.maxGrade,
      examDate: d.examDate ?? null,
      teachers: d.teachers,
      studentId,
    })),
    skipDuplicates: true,
  });
}

/**
 * =========================
 * EVENTS
 * =========================
 */
export async function saveEvents(disciplineId: number, raw: unknown) {
  const events = validateEvents(raw);

  return prisma.event.createMany({
    data: events.map((e) => ({
      alias: e.alias ?? null,
      name: e.name ?? null,
      type: e.type,
      week: e.week,
      currentGrade: e.currentGrade ?? null,
      maxGrade: e.maxGrade,
      disciplineId,
    })),
    skipDuplicates: true,
  });
}

/**
 * =========================
 * SCHEDULE QUERY BY DATE
 * =========================
 */
export async function getScheduleByDate(date: Date, groupId: number) {
  const map = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ] as const;

  const dayOfWeek = map[date.getDay()];

  if (!dayOfWeek) {
    throw new Error("Invalid dayOfWeek");
  }

  return prisma.schedule.findMany({
    where: {
      groupId,
      dayOfWeek,
    },
    include: {
      lessons: true,
    },
  });
}

/**
 * =========================
 * EVENTS BY DATE
 * =========================
 */
export async function getEventsByDate(date: Date, studentId: number) {
  const week = getWeekNumber(date);

  return prisma.event.findMany({
    where: {
      week,
      discipline: {
        studentId,
      },
    },
  });
}

/**
 * =========================
 * WEEK CALCULATION
 * =========================
 */
function getWeekNumber(date: Date) {
  const firstJan = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - firstJan.getTime();
  return Math.ceil(diff / (7 * 24 * 60 * 60 * 1000));
}