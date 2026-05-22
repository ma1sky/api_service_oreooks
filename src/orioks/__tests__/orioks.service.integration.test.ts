import orioksApiService from "../orioks.service";

describe("ORIOKS API Integration extended tests", () => {
  const TOKEN = process.env.TEST_TOKEN;

  if (!TOKEN) {
    console.warn("TEST_TOKEN not set, skipping integration tests");
    return;
  }

  it("should not return empty student fields", async () => {
    const result = await orioksApiService.getStudent(TOKEN);

    expect(result.full_name).not.toBe("");
    expect(result.department).toBeTruthy();
    expect(result.record_book_id).toBeGreaterThan(100000);
  });

  // =========================
  // TOKEN CONSISTENCY
  // =========================

  it("should return same student data on repeated calls (cache consistency check)", async () => {
    const r1 = await orioksApiService.getStudent(TOKEN);
    const r2 = await orioksApiService.getStudent(TOKEN);

    expect(r1.record_book_id).toBe(r2.record_book_id);
    expect(r1.full_name).toBe(r2.full_name);
  });

  // =========================
  // GROUP STRUCTURE VALIDATION
  // =========================

  it("groups should contain valid structure", async () => {
    const groups = await orioksApiService.getGroups(TOKEN);

    for (const group of groups) {
      expect(group).toHaveProperty("id");
      expect(typeof group.id).toBe("number");
      expect(group.name).toBeTruthy();
      expect(typeof group.name).toBe("string");
    }
  });

  // =========================
  // TIMETABLE SHAPE VALIDATION
  // =========================

  it("timetable should have numeric keys and arrays", async () => {
    const timetable = await orioksApiService.getTimetable(TOKEN);

    for (const key of Object.keys(timetable)) {
      expect(Number.isNaN(Number(key))).toBe(false);
      expect(Array.isArray((timetable as any)[key])).toBe(true);
    }
  });

  // =========================
  // SEMESTER DATE LOGIC
  // =========================

  it("should fetch semester info", async () => {
    const result = await orioksApiService.getSemesterInfo(TOKEN);

    expect(result.semester_start).toBeTruthy();

    if (result.session_start) {
      const semesterStart = Date.parse(result.semester_start);
      const sessionStart = Date.parse(result.session_start);

      expect(Number.isNaN(semesterStart)).toBe(false);
      expect(Number.isNaN(sessionStart)).toBe(false);

      expect(semesterStart).toBeLessThan(sessionStart);
    } else {
      console.warn("session_start is empty in API response");
    }
  });

  // =========================
  // DISCIPLINES VALIDATION
  // =========================

  it("disciplines should have valid grade ranges", async () => {
    const disciplines = await orioksApiService.getDisciplines(TOKEN);

    for (const d of disciplines) {
      expect(d.max_grade).toBeGreaterThan(0);
      expect(d.id).toBeGreaterThan(0);
      expect(d.name.length).toBeGreaterThan(2);
    }
  });

  // =========================
  // EVENTS VALIDATION
  // =========================

  it("discipline events should have valid weeks", async () => {
    const disciplines = await orioksApiService.getDisciplines(TOKEN);

    if (disciplines.length === 0) return;

    const events = await orioksApiService.getDisciplineEvents(
      TOKEN,
      disciplines[0]!.id,
    );

    for (const event of events) {
      expect(event.week).toBeGreaterThan(0);
      expect(event.max_grade).toBeGreaterThanOrEqual(0);
      expect(typeof event.name).toBe("string");
    }
  });

  // =========================
  // ERROR HANDLING REAL API
  // =========================

  it("should handle invalid discipline gracefully", async () => {
    await expect(
      orioksApiService.getDisciplineEvents(TOKEN, 999999999),
    ).rejects.toThrow();
  });

  // =========================
  // PERFORMANCE BASIC CHECK
  // =========================

  it("student request should complete in reasonable time", async () => {
    const start = Date.now();

    await orioksApiService.getStudent(TOKEN);

    const duration = Date.now() - start;

    expect(duration).toBeLessThan(5000); // 5 sec limit
  });
});
