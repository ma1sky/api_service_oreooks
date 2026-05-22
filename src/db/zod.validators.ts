import { z } from "zod";
import {
  StudentApiSchema,
  SemesterInfoSchema,
  TimetableSchema,
  ScheduleSchema,
  DisciplineSchema,
  EventSchema,
  GroupSchema,
  LessonSchema,
} from "./zod.schemas";

/**
 * =========================
 * SAFE PARSE
 * =========================
 */

function safeParse<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new Error(
      `Validation error: ${JSON.stringify(result.error.flatten())}`,
    );
  }

  return result.data;
}

/**
 * =========================
 * STUDENT (API)
 * =========================
 */

export const validateStudentApi = (data: unknown) =>
  safeParse(StudentApiSchema, data);

/**
 * alias for backward compatibility
 */
export const validateStudent = validateStudentApi;

/**
 * =========================
 * SEMESTER INFO
 * =========================
 */

export const validateSemesterInfo = (data: unknown) =>
  safeParse(SemesterInfoSchema, data);

/**
 * =========================
 * TIMETABLE
 * =========================
 */

export const validateTimetable = (data: unknown) =>
  safeParse(z.array(TimetableSchema), data);

/**
 * =========================
 * GROUPS
 * =========================
 */

export const validateGroup = (data: unknown) => safeParse(GroupSchema, data);

export const validateGroups = (data: unknown) =>
  safeParse(z.array(GroupSchema), data);

/**
 * =========================
 * SCHEDULE
 * =========================
 */

export const validateSchedule = (data: unknown) =>
  safeParse(ScheduleSchema, data);

/**
 * =========================
 * DISCIPLINES
 * =========================
 */

export const validateDiscipline = (data: unknown) =>
  safeParse(DisciplineSchema, data);

export const validateDisciplines = (data: unknown) =>
  safeParse(z.array(DisciplineSchema), data);

/**
 * =========================
 * EVENTS
 * =========================
 */

export const validateEvent = (data: unknown) => safeParse(EventSchema, data);

export const validateEvents = (data: unknown) =>
  safeParse(z.array(EventSchema), data);

/**
 * =========================
 * LESSON
 * =========================
 */

export const validateLesson = (data: unknown) => safeParse(LessonSchema, data);

export const validateLessons = (data: unknown) =>
  safeParse(z.array(LessonSchema), data);
