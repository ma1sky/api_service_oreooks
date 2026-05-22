import orioksApiService from "../orioks.service";

const mockFetch = jest.fn();

globalThis.fetch = mockFetch as any;

describe("ORIOKS API Service", () => {
  const TOKEN = "12345678901234567890123456789012";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =====================================================
  // AUTH / COMMON ERRORS
  // =====================================================

  describe("Common API errors", () => {
    it("should throw 401 error for invalid token", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({
          error: "Несуществующий или аннулированный токен",
        }),
      } as any);

      await expect(orioksApiService.getStudent(TOKEN)).rejects.toThrow(
        "Несуществующий или аннулированный токен",
      );
    });

    it("should throw 404 error", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({
          error: "Отсутствует ресурс по данному URI",
        }),
      } as any);

      await expect(orioksApiService.getGroups(TOKEN)).rejects.toThrow(
        "Отсутствует ресурс по данному URI",
      );
    });

    it("should throw 410 error", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 410,
        json: async () => ({
          error: "Данная версия API устарела",
        }),
      } as any);

      await expect(orioksApiService.getSemesterInfo(TOKEN)).rejects.toThrow(
        "Данная версия API устарела",
      );
    });

    it("should throw invalid Accept header error", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({
          error: "Недопустимый формат заголовка Accept",
        }),
      } as any);

      await expect(orioksApiService.getTimetable(TOKEN)).rejects.toThrow(
        "Недопустимый формат заголовка Accept",
      );
    });

    it("should throw invalid User-Agent error", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({
          error: "Недопустимый формат заголовка User-Agent",
        }),
      } as any);

      await expect(orioksApiService.getGroups(TOKEN)).rejects.toThrow(
        "Недопустимый формат заголовка User-Agent",
      );
    });
  });

  // =====================================================
  // STUDENT
  // =====================================================

  describe("getStudent", () => {
    it("should return student info", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          course: 1,
          department: "ИПОВС",
          full_name: "Иванов Иван Иванович",
          group: "МП-15",
          record_book_id: 8120843,
          semester: 2,
          study_direction: "Программная инженерия",
          study_profile: "Программные технологии",
          year: "2017-2018",
        }),
      } as any);

      const result = await orioksApiService.getStudent(TOKEN);

      expect(result.course).toBe(1);
      expect(result.department).toBe("ИПОВС");
      expect(result.full_name).toMatch(/Иванов/);
    });
  });

  // =====================================================
  // GROUPS
  // =====================================================

  describe("getGroups", () => {
    it("should return groups list", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [{ id: 1, name: "ПИН-11М" }],
      } as any);

      const result = await orioksApiService.getGroups(TOKEN);

      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe(1);
    });
  });

  // =====================================================
  // TIMETABLE
  // =====================================================

  describe("getTimetable", () => {
    it("should return timetable", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          1: ["09:00", "10:30"],
          2: ["10:40", "12:10"],
        }),
      } as any);

      const result = await orioksApiService.getTimetable(TOKEN);

      expect(result["1"]).toEqual(["09:00", "10:30"]);
    });
  });

  // =====================================================
  // SEMESTER INFO
  // =====================================================

  describe("getSemesterInfo", () => {
    it("should return semester info", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          semester_start: "2025-09-01",
          session_start: "2025-12-20",
          session_end: "2026-01-10",
        }),
      } as any);

      const result = await orioksApiService.getSemesterInfo(TOKEN);

      expect(result.semester_start).toBe("2025-09-01");
    });
  });

  // =====================================================
  // GROUP SCHEDULE
  // =====================================================

  describe("getGroupSchedule", () => {
    it("should return group schedule", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          last_updated: "2025-01-01T12:00",
          semester: "Весенний семестр 2025",
        }),
      } as any);

      const result = await orioksApiService.getGroupSchedule(TOKEN, 1);

      expect(result.semester).toContain("2025");
    });
  });

  // =====================================================
  // LAST UPDATED
  // =====================================================

  describe("getLastUpdated", () => {
    it("should return last updated date", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          last_updated: "2025-01-01T12:00",
        }),
      } as any);

      const result = await orioksApiService.getLastUpdated(TOKEN, 1);

      expect(result.last_updated).toBe("2025-01-01T12:00");
    });
  });

  // =====================================================
  // DISCIPLINES
  // =====================================================

  describe("getDisciplines", () => {
    it("should return disciplines", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [
          {
            id: 25,
            name: "Архитектура ЭВМ",
            max_grade: 100,
            department: "ИПОВС",
          },
        ],
      } as any);

      const result = await orioksApiService.getDisciplines(TOKEN);

      expect(result[0]?.id).toBe(25);
      expect(result[0]?.name).toBe("Архитектура ЭВМ");
    });
  });

  // =====================================================
  // EVENTS
  // =====================================================

  describe("getDisciplineEvents", () => {
    it("should return events", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [
          {
            alias: "КР.1",
            week: 1,
            name: "Контрольная работа",
          },
        ],
      } as any);

      const result = await orioksApiService.getDisciplineEvents(TOKEN, 1);

      expect(result[0]?.alias).toBe("КР.1");
      expect(result[0]?.week).toBe(1);
    });

    it("should throw invalid discipline id error", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({
          error: "Дисциплины с данным идентификатором не существует",
        }),
      } as any);

      await expect(
        orioksApiService.getDisciplineEvents(TOKEN, 999),
      ).rejects.toThrow("Дисциплины с данным идентификатором не существует");
    });
  });
});
