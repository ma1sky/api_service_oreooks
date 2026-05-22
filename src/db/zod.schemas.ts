import { z } from "zod";

/**
 * =========================
 * ENUMS
 * =========================
 */

export const TaskStateSchema = z.enum(["draft", "completed"]);

export const DaySchema = z.enum([
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]);

/**
 * =========================
 * HELPERS
 * =========================
 */

const dateFromString = z.preprocess((v) => {
  if (!v || v === "") return null;
  const d = new Date(String(v));
  return isNaN(d.getTime()) ? null : d;
}, z.date().nullable());

/**
 * =========================
 * USER / STUDENT (API SHAPE)
 * =========================
 */

export const StudentApiSchema = z.object({
  course: z.number(),
  department: z.string(),

  full_name: z.string(),
  group: z.string(),

  record_book_id: z.number(),

  semester: z.number(),

  study_direction: z.string(),
  study_profile: z.string(),

  year: z.string(),
});

/**
 * =========================
 * GROUP
 * =========================
 */

export const GroupSchema = z.object({
  id: z.number(),
  orioksId: z.number(),
  name: z.string(),
});

/**
 * =========================
 * SEMESTER INFO
 * =========================
 */

export const SemesterInfoSchema = z.object({
  semesterStart: dateFromString,
  sessionStart: dateFromString,
  sessionEnd: dateFromString,
  nextSemesterStart: dateFromString,
});

/**
 * =========================
 * TIMETABLE
 * =========================
 */

export const TimetableSchema = z.object({
  lessonNumber: z.number(),
  startTime: z.string(),
  endTime: z.string(),
});

/**
 * =========================
 * LESSON
 * =========================
 */

export const LessonSchema = z.object({
  id: z.number(),

  lessonNumber: z.number(),
  lessonName: z.string(),
  lessonType: z.string(),

  teacher: z.string(),
  teacherInitials: z.string().nullable(),

  classroom: z.string(),

  scheduleId: z.number(),
});

/**
 * =========================
 * SCHEDULE
 * =========================
 */

export const ScheduleSchema = z.object({
  id: z.number(),

  groupId: z.number(),

  semesterLabel: z.string(),

  weekVariant: z.number(),

  dayOfWeek: DaySchema,

  lastUpdated: dateFromString,
});

/**
 * =========================
 * DISCIPLINE
 * =========================
 */

export const DisciplineSchema = z.object({
  id: z.number(),
  orioksId: z.number(),

  name: z.string(),
  department: z.string(),

  controlForm: z.string().nullable(),

  currentGrade: z.number().nullable(),
  maxGrade: z.number(),

  examDate: dateFromString,

  teachers: z.array(z.string()),

  studentId: z.number(),
});

/**
 * =========================
 * EVENT
 * =========================
 */

export const EventSchema = z.object({
  id: z.number(),

  alias: z.string().nullable(),
  name: z.string().nullable(),

  type: z.string(),

  week: z.number(),

  currentGrade: z.number().nullable(),
  maxGrade: z.number(),

  disciplineId: z.number(),
});

/**
 * =========================
 * TASK
 * =========================
 */

export const TaskSchema = z.object({
  id: z.number(),

  title: z.string(),
  description: z.string(),

  deadline: dateFromString,

  state: TaskStateSchema,

  authorId: z.number(),
});
