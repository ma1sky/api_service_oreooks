import { ORIOKS_LINK } from "../config/env.config";

export type StudentResponse = {
  course: number;
  department: string;
  full_name: string;
  group: string;
  record_book_id: number;
  semester: number;
  study_direction: string;
  study_profile: string;
  year: string;
};

export type GroupResponse = {
  id: number;
  name: string;
};

export type SemesterInfoResponse = {
  semester_start: string;
  session_start?: string;
  session_end?: string;
  next_semester_start?: string;
};

export type TimetableResponse = Record<string, [string, string]>;

export type ScheduleLessonResponse = {
  classroom: string;
  name: string;
  teacher: string;
  teacher_initials?: string;
  type: string;
};

export type GroupScheduleResponse = {
  last_updated: string;
  semester: string;

  [key: string]:
    | string
    | {
        [key: string]: {
          [key: string]: ScheduleLessonResponse;
        };
      };
};

export type DisciplineResponse = {
  control_form?: string;
  current_grade?: number;
  department: string;
  exam_date?: string;
  id: number;
  max_grade: number;
  name: string;
  teachers?: string[];
};

export type EventResponse = {
  alias?: string;
  current_grade?: number;
  max_grade: number;
  name?: string;
  type: string;
  week: number;
};

class OrioksApiService {
  private baseUrl = ORIOKS_LINK.replace("http://", "https://");

  // ==================================================
  // BASE REQUEST
  // ==================================================

  private async request<T>(token: string, endpoint: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "User-Agent": "Oreooks-bot/1.0 Windows 11",
      },
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(
        data?.error || data?.message || `ORIOKS API error (${res.status})`,
      );
    }

    return data as T;
  }

  // ==================================================
  // STUDENT
  // GET /api/v1/student
  // ==================================================

  async getStudent(token: string): Promise<StudentResponse> {
    return this.request<StudentResponse>(token, "/api/v1/student");
  }

  // ==================================================
  // GROUPS
  // GET /api/v1/schedule/groups
  // ==================================================

  async getGroups(token: string): Promise<GroupResponse[]> {
    return this.request<GroupResponse[]>(token, "/api/v1/schedule/groups");
  }

  // ==================================================
  // SEMESTER INFO
  // GET /api/v1/schedule
  // ==================================================

  async getSemesterInfo(token: string): Promise<SemesterInfoResponse> {
    return this.request<SemesterInfoResponse>(token, "/api/v1/schedule");
  }

  // ==================================================
  // TIMETABLE
  // GET /api/v1/schedule/timetable
  // ==================================================

  async getTimetable(token: string): Promise<TimetableResponse> {
    return this.request<TimetableResponse>(token, "/api/v1/schedule/timetable");
  }

  // ==================================================
  // GROUP SCHEDULE
  // GET /api/v1/schedule/groups/:groupId
  // ==================================================

  async getGroupSchedule(
    token: string,
    groupId: number,
  ): Promise<GroupScheduleResponse> {
    return this.request<GroupScheduleResponse>(
      token,
      `/api/v1/schedule/groups/${groupId}`,
    );
  }

  // ==================================================
  // LAST UPDATED
  // GET /api/v1/schedule/groups/:groupId/last_updated
  // ==================================================

  async getLastUpdated(
    token: string,
    groupId: number,
  ): Promise<{
    last_updated: string;
  }> {
    return this.request<{
      last_updated: string;
    }>(token, `/api/v1/schedule/groups/${groupId}/last_updated`);
  }

  // ==================================================
  // DISCIPLINES
  // GET /api/v1/student/disciplines
  // ==================================================

  async getDisciplines(token: string): Promise<DisciplineResponse[]> {
    return this.request<DisciplineResponse[]>(
      token,
      "/api/v1/student/disciplines",
    );
  }

  // ==================================================
  // EVENTS
  // GET /api/v1/student/disciplines/:disciplineId/events
  // ==================================================

  async getDisciplineEvents(
    token: string,
    disciplineId: number,
  ): Promise<EventResponse[]> {
    return this.request<EventResponse[]>(
      token,
      `/api/v1/student/disciplines/${disciplineId}/events`,
    );
  }
}

export default new OrioksApiService();
