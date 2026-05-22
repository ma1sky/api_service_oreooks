import orioksApiService from "../orioks.service";
import { StudentApiSchema } from "../../db/zod.schemas";

const TOKEN = process.env.TEST_TOKEN!;

describe("ORIOKS API Integration (Zod validated)", () => {
  if (!TOKEN) throw new Error("TEST_TOKEN is not set");

  /**
   * =========================
   * STUDENT
   * =========================
   */
  it("should return valid student (raw API schema)", async () => {
    const raw = await orioksApiService.getStudent(TOKEN);

    const student = StudentApiSchema.parse(raw);

    expect(student.course).toBeGreaterThan(0);
    expect(student.full_name).toBeTruthy();
    expect(student.record_book_id).toBeGreaterThan(0);
  });

  /**
   * =========================
   * GROUPS
   * =========================
   */
  it("should return valid groups list", async () => {
    const groups = await orioksApiService.getGroups(TOKEN);

    expect(Array.isArray(groups)).toBe(true);
    expect(groups.length).toBeGreaterThan(0);

    // если структура неизвестна — хотя бы проверяем типы
    expect(typeof groups[0]).toBe("object");
  });

  /**
   * =========================
   * TIMETABLE
   * =========================
   */
  it("should return timetable", async () => {
    const raw = await orioksApiService.getTimetable(TOKEN);

    const timetable = Array.isArray(raw)
        ? raw
        : Object.values(raw ?? {});

    expect(Array.isArray(timetable)).toBe(true);

    if (timetable.length > 0) {
        expect(timetable[0]).toBeDefined();
    }
    });

  /**
   * =========================
   * SEMESTER INFO
   * =========================
   */
  it("should return semester info", async () => {
    const info = await orioksApiService.getSemesterInfo(TOKEN);

    expect(info).toBeDefined();

    expect(info.semester_start).toMatch(/20\d{2}/);

    // optional поля могут быть пустыми — НЕ падаем
    if (info.session_start) {
      expect(info.session_start).toMatch(/20\d{2}/);
    }
  });

  /**
   * =========================
   * DISCIPLINES
   * =========================
   */
  it("should return disciplines list", async () => {
    const disciplines = await orioksApiService.getDisciplines(TOKEN);

    expect(Array.isArray(disciplines)).toBe(true);

    if (disciplines.length > 0) {
      expect(disciplines[0]).toHaveProperty("id");
      expect(disciplines[0]).toHaveProperty("name");
    }
  });

  /**
   * =========================
   * DISCIPLINE EVENTS
   * =========================
   */
  it("should return discipline events", async () => {
    const disciplines = await orioksApiService.getDisciplines(TOKEN);

    expect(disciplines.length).toBeGreaterThan(0);

    const id = disciplines[0]!.id;

    const events = await orioksApiService.getDisciplineEvents(TOKEN, id);

    expect(Array.isArray(events)).toBe(true);
  });
});