import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { readJson, writeJson } from "@/lib/local-store";
import { seedCourses, type Course, type Unit, type Lesson } from "@/lib/academy-data";

// مخزن الكورسات — الأدمن بيتحكم فيه من /admin. مبني على localStorage مؤقتاً
// (mock) لحد ما يتحط backend حقيقي. Context واحد مشترك (مش hook مستقل لكل
// component) عشان لو أكتر من عنصر بيستخدموه في نفس الوقت (زي CoursesPanel
// وCourseEditor) يفضلوا شايفين نفس النسخة من غير سباق تحديثات.

const STORAGE_KEY = "academy-courses-v1";

function slugify(title: string) {
  return (
    title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9؀-ۿ]+/g, "-")
      .replace(/^-+|-+$/g, "") || crypto.randomUUID().slice(0, 8)
  );
}

type CoursesContextValue = {
  courses: Course[];
  addCourse: (input: {
    title: string;
    subtitle: string;
    requiresSubscription: boolean;
    instructorName: string;
    instructorTitle: string;
    instructorBio: string;
  }) => Course;
  updateCourse: (courseId: string, patch: Partial<Course>) => void;
  deleteCourse: (courseId: string) => void;
  addUnit: (courseId: string, title: string) => void;
  updateUnit: (courseId: string, unitId: string, title: string) => void;
  deleteUnit: (courseId: string, unitId: string) => void;
  addLesson: (courseId: string, unitId: string, lesson: Omit<Lesson, "id">) => void;
  updateLesson: (
    courseId: string,
    unitId: string,
    lessonId: string,
    patch: Partial<Lesson>
  ) => void;
  deleteLesson: (courseId: string, unitId: string, lessonId: string) => void;
};

const CoursesContext = createContext<CoursesContextValue | null>(null);

export function CoursesProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<Course[]>(() => readJson(STORAGE_KEY, seedCourses));

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) setCourses(readJson(STORAGE_KEY, seedCourses));
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function persist(next: Course[]) {
    setCourses(next);
    writeJson(STORAGE_KEY, next);
  }

  function addCourse(input: {
    title: string;
    subtitle: string;
    requiresSubscription: boolean;
    instructorName: string;
    instructorTitle: string;
    instructorBio: string;
  }) {
    const course: Course = {
      id: crypto.randomUUID(),
      slug: slugify(input.title),
      title: input.title,
      subtitle: input.subtitle,
      requiresSubscription: input.requiresSubscription,
      instructor: {
        name: input.instructorName,
        title: input.instructorTitle,
        bio: input.instructorBio,
      },
      units: [],
    };
    persist([...courses, course]);
    return course;
  }

  function updateCourse(courseId: string, patch: Partial<Course>) {
    persist(courses.map((c) => (c.id === courseId ? { ...c, ...patch } : c)));
  }

  function deleteCourse(courseId: string) {
    persist(courses.filter((c) => c.id !== courseId));
  }

  function addUnit(courseId: string, title: string) {
    const unit: Unit = { id: crypto.randomUUID(), title, lessons: [] };
    persist(
      courses.map((c) => (c.id === courseId ? { ...c, units: [...c.units, unit] } : c))
    );
  }

  function updateUnit(courseId: string, unitId: string, title: string) {
    persist(
      courses.map((c) =>
        c.id === courseId
          ? { ...c, units: c.units.map((u) => (u.id === unitId ? { ...u, title } : u)) }
          : c
      )
    );
  }

  function deleteUnit(courseId: string, unitId: string) {
    persist(
      courses.map((c) =>
        c.id === courseId ? { ...c, units: c.units.filter((u) => u.id !== unitId) } : c
      )
    );
  }

  function addLesson(courseId: string, unitId: string, lesson: Omit<Lesson, "id">) {
    const newLesson: Lesson = { ...lesson, id: crypto.randomUUID() };
    persist(
      courses.map((c) =>
        c.id === courseId
          ? {
              ...c,
              units: c.units.map((u) =>
                u.id === unitId ? { ...u, lessons: [...u.lessons, newLesson] } : u
              ),
            }
          : c
      )
    );
  }

  function updateLesson(
    courseId: string,
    unitId: string,
    lessonId: string,
    patch: Partial<Lesson>
  ) {
    persist(
      courses.map((c) =>
        c.id === courseId
          ? {
              ...c,
              units: c.units.map((u) =>
                u.id === unitId
                  ? {
                      ...u,
                      lessons: u.lessons.map((l) =>
                        l.id === lessonId ? { ...l, ...patch } : l
                      ),
                    }
                  : u
              ),
            }
          : c
      )
    );
  }

  function deleteLesson(courseId: string, unitId: string, lessonId: string) {
    persist(
      courses.map((c) =>
        c.id === courseId
          ? {
              ...c,
              units: c.units.map((u) =>
                u.id === unitId
                  ? { ...u, lessons: u.lessons.filter((l) => l.id !== lessonId) }
                  : u
              ),
            }
          : c
      )
    );
  }

  return (
    <CoursesContext.Provider
      value={{
        courses,
        addCourse,
        updateCourse,
        deleteCourse,
        addUnit,
        updateUnit,
        deleteUnit,
        addLesson,
        updateLesson,
        deleteLesson,
      }}
    >
      {children}
    </CoursesContext.Provider>
  );
}

export function useCourses(): CoursesContextValue {
  const ctx = useContext(CoursesContext);
  if (!ctx) throw new Error("useCourses must be used within CoursesProvider");
  return ctx;
}
