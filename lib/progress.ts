import { useEffect, useState } from "react";

// تتبع الدروس المكتملة محلياً (localStorage) لحد ما يتحط backend حقيقي

function storageKey(courseId: string) {
  return `academy-progress-${courseId}`;
}

function readCompleted(courseId: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(storageKey(courseId));
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

export function useCourseProgress(courseId: string) {
  const [completed, setCompleted] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    setCompleted(readCompleted(courseId));
  }, [courseId]);

  function markCompleted(lessonId: string) {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.add(lessonId);
      window.localStorage.setItem(storageKey(courseId), JSON.stringify([...next]));
      return next;
    });
  }

  function isCompleted(lessonId: string) {
    return completed.has(lessonId);
  }

  return { completed, markCompleted, isCompleted };
}
