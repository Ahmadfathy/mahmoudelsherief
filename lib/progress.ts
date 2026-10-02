import { useCallback, useEffect, useState } from "react";
import { apiRequest, getStudentToken } from "@/lib/api";

type ProgressRow = {
  lesson_id: number;
  completed_at?: string | null;
  last_position_seconds?: number;
};

export function useCourseProgress(courseId: string, enabled = true) {
  const [completed, setCompleted] = useState<Set<string>>(() => new Set());

  const refresh = useCallback(async () => {
    const token = getStudentToken();
    if (!courseId || !enabled || !token) {
      setCompleted(new Set());
      return;
    }
    try {
      const response = await apiRequest<{ progress: ProgressRow[] }>(
        `/courses/${courseId}/progress`,
        { token }
      );
      setCompleted(
        new Set(
          response.progress
            .filter((row) => Boolean(row.completed_at))
            .map((row) => String(row.lesson_id))
        )
      );
    } catch {
      setCompleted(new Set());
    }
  }, [courseId, enabled]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function markCompleted(lessonId: string) {
    const token = getStudentToken();
    if (!token) return;
    await apiRequest(`/lessons/${lessonId}/progress`, {
      method: "PUT",
      token,
      body: JSON.stringify({ completed: true }),
    });
    setCompleted((previous) => new Set(previous).add(lessonId));
  }

  function isCompleted(lessonId: string) {
    return completed.has(lessonId);
  }

  return { completed, markCompleted, isCompleted, refresh };
}
