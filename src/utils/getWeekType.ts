export type WeekType =
  | "first_numerator"
  | "first_denominator"
  | "second_numerator"
  | "second_denominator";

type CycleIndex = 0 | 1 | 2 | 3;

const WEEK_TYPES: Record<CycleIndex, WeekType> = {
  0: "first_numerator",
  1: "first_denominator",
  2: "second_numerator",
  3: "second_denominator",
};

function parseDate(date: string | Date): Date {
  if (date instanceof Date) return date;
  return new Date(date);
}

function toMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 (Sun) - 6 (Sat)

  const diff = day === 0 ? -6 : 1 - day;

  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);

  return d;
}

export interface AcademicWeekInfo {
  currentWeek: number;
  weekType: WeekType;
  cycleIndex: number;
}

export function getAcademicWeekInfo(
  semesterStartIso: string | Date,
  now: Date = new Date(),
): AcademicWeekInfo {
  const semesterStart = parseDate(semesterStartIso);

  const startMonday = toMonday(semesterStart);
  const nowMonday = toMonday(now);

  const msPerWeek = 7 * 24 * 60 * 60 * 1000;

  const weeksPassed = Math.floor(
    (nowMonday.getTime() - startMonday.getTime()) / msPerWeek,
  );

  const currentWeek = weeksPassed + 1;

  const cycleIndex = (((weeksPassed % 4) + 4) % 4) as CycleIndex;

  return {
    currentWeek,
    weekType: WEEK_TYPES[cycleIndex],
    cycleIndex,
  };
}
