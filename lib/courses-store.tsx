import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Course, Lesson, Unit } from "@/lib/academy-data";
import { apiRequest, friendlyApiError, getAdminToken, getStudentToken } from "@/lib/api";

type JsonRecord = Record<string, unknown>;

function text(value: unknown) {
  return typeof value === "string" ? value : "";
}

function number(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function durationLabel(seconds: number) {
  if (!seconds) return undefined;
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

function mapLesson(raw: JsonRecord): Lesson {
  const resources = Array.isArray(raw.resources) ? (raw.resources as JsonRecord[]) : [];
  const links = resources
    .filter((resource) => resource.type === "link" && resource.url)
    .map((resource) => ({ id: String(resource.id), label: text(resource.label), url: text(resource.url) }));
  const files = resources
    .filter((resource) => resource.type === "file")
    .map((resource) => ({
      id: String(resource.id),
      label: text(resource.label),
      url: `/lesson-resources/${resource.id}/download`,
    }));
  const seconds = number(raw.duration_seconds);

  return {
    id: String(raw.id),
    title: text(raw.title),
    description: text(raw.description) || undefined,
    videoType: (text(raw.video_type) || undefined) as Lesson["videoType"],
    videoUrl: text(raw.video_url) || undefined,
    durationSeconds: seconds || undefined,
    durationLabel: durationLabel(seconds),
    links,
    files,
    isPreview: Boolean(raw.is_preview),
    isPublished: raw.is_published === undefined ? true : Boolean(raw.is_published),
    sortOrder: number(raw.sort_order),
  };
}

function mapUnit(raw: JsonRecord): Unit {
  return {
    id: String(raw.id),
    title: text(raw.title),
    lessons: Array.isArray(raw.lessons) ? (raw.lessons as JsonRecord[]).map(mapLesson) : [],
    isPublished: raw.is_published === undefined ? true : Boolean(raw.is_published),
    sortOrder: number(raw.sort_order),
  };
}

export function mapCourse(raw: JsonRecord): Course {
  const units = Array.isArray(raw.units) ? (raw.units as JsonRecord[]).map(mapUnit) : [];
  return {
    id: String(raw.id),
    slug: text(raw.slug),
    title: text(raw.title),
    subtitle: text(raw.subtitle),
    description: text(raw.description) || undefined,
    coverImageUrl: text(raw.cover_image_url) || undefined,
    price: number(raw.price),
    currency: text(raw.currency) || "EGP",
    requiresSubscription: raw.requires_subscription === undefined ? true : Boolean(raw.requires_subscription),
    isPublished: Boolean(raw.is_published),
    sortOrder: number(raw.sort_order),
    unitsCount: number(raw.units_count, units.length),
    lessonsCount: number(raw.lessons_count, units.reduce((total, unit) => total + unit.lessons.length, 0)),
    subscriptionsCount: number(raw.subscriptions_count),
    instructor: {
      name: text(raw.instructor_name) || "المدرب",
      title: text(raw.instructor_title),
      bio: text(raw.instructor_bio),
    },
    units,
  };
}

type CourseInput = {
  title: string;
  subtitle: string;
  requiresSubscription: boolean;
  instructorName: string;
  instructorTitle: string;
  instructorBio: string;
  price: number;
};

type CoursesContextValue = {
  courses: Course[];
  loading: boolean;
  error: string;
  refreshCourses: () => Promise<void>;
  loadCourse: (slug: string, authenticated?: boolean) => Promise<Course>;
  loadAdminCourses: () => Promise<void>;
  loadAdminCourse: (courseId: string) => Promise<Course>;
  addCourse: (input: CourseInput) => Promise<Course>;
  updateCourse: (courseId: string, patch: Partial<Course>) => Promise<void>;
  deleteCourse: (courseId: string) => Promise<void>;
  addUnit: (courseId: string, title: string) => Promise<void>;
  updateUnit: (courseId: string, unitId: string, title: string) => Promise<void>;
  deleteUnit: (courseId: string, unitId: string) => Promise<void>;
  addLesson: (courseId: string, unitId: string, lesson: Omit<Lesson, "id">) => Promise<void>;
  updateLesson: (courseId: string, unitId: string, lessonId: string, patch: Partial<Lesson>) => Promise<void>;
  deleteLesson: (courseId: string, unitId: string, lessonId: string) => Promise<void>;
};

const CoursesContext = createContext<CoursesContextValue | null>(null);

function videoType(url?: string): Lesson["videoType"] {
  if (!url) return "url";
  if (/youtu\.be|youtube\.com/i.test(url)) return "youtube";
  if (/vimeo\.com/i.test(url)) return "vimeo";
  return "url";
}

function parseDuration(label?: string) {
  if (!label) return undefined;
  const parts = label.split(":").map(Number);
  if (parts.some((part) => !Number.isFinite(part))) return undefined;
  return parts.length === 2 ? parts[0] * 60 + parts[1] : parts[0];
}

function lessonFormData(lesson: Partial<Lesson>, creating = false) {
  const form = new FormData();
  if (lesson.title !== undefined) form.append("title", lesson.title);
  if (lesson.description !== undefined) form.append("description", lesson.description || "");
  if (lesson.videoFile) {
    form.append("video", lesson.videoFile);
    form.append("video_type", "upload");
  } else if (lesson.videoUrl !== undefined) {
    form.append("video_url", lesson.videoUrl || "");
    form.append("video_type", videoType(lesson.videoUrl) ?? "url");
  }
  const seconds = lesson.durationSeconds ?? parseDuration(lesson.durationLabel);
  if (seconds !== undefined) form.append("duration_seconds", String(seconds));
  if (lesson.isPreview !== undefined) form.append("is_preview", lesson.isPreview ? "1" : "0");
  if (lesson.isPublished !== undefined) form.append("is_published", lesson.isPublished ? "1" : "0");
  if (lesson.sortOrder !== undefined) form.append("sort_order", String(lesson.sortOrder));

  const resources = [
    ...(lesson.links ?? []).map((item) => ({ ...item, type: "link" })),
    ...(lesson.files ?? []).map((item) => ({ ...item, type: "link" })),
  ];
  if (creating || lesson.links !== undefined || lesson.files !== undefined) {
    resources.forEach((resource, index) => {
      form.append(`resources[${index}][type]`, resource.type);
      form.append(`resources[${index}][label]`, resource.label);
      form.append(`resources[${index}][url]`, resource.url);
      form.append(`resources[${index}][sort_order]`, String(index));
    });
    if (resources.length === 0) form.append("clear_resources", "1");
  }
  return form;
}

export function CoursesProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const replaceCourse = useCallback((course: Course) => {
    setCourses((current) => {
      const exists = current.some((item) => item.id === course.id);
      return exists ? current.map((item) => (item.id === course.id ? course : item)) : [...current, course];
    });
  }, []);

  const refreshCourses = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await apiRequest<{ data: JsonRecord[] }>("/courses");
      setCourses(response.data.map(mapCourse));
    } catch (requestError) {
      setError(friendlyApiError(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshCourses();
  }, [refreshCourses]);

  async function loadCourse(slug: string, authenticated = false) {
    const token = authenticated ? getStudentToken() : null;
    const path = token ? `/my-courses/${slug}` : `/courses/${slug}`;
    const response = await apiRequest<{ course: JsonRecord }>(path, { token });
    const course = mapCourse(response.course);
    replaceCourse(course);
    return course;
  }

  async function loadAdminCourses() {
    const token = getAdminToken();
    const response = await apiRequest<{ data: JsonRecord[] }>("/admin/courses", { token });
    setCourses(response.data.map(mapCourse));
  }

  async function loadAdminCourse(courseId: string) {
    const response = await apiRequest<{ course: JsonRecord }>(`/admin/courses/${courseId}`, {
      token: getAdminToken(),
    });
    const course = mapCourse(response.course);
    replaceCourse(course);
    return course;
  }

  async function addCourse(input: CourseInput) {
    const response = await apiRequest<{ course: JsonRecord }>("/admin/courses", {
      method: "POST",
      token: getAdminToken(),
      body: JSON.stringify({
        title: input.title,
        subtitle: input.subtitle || null,
        requires_subscription: input.requiresSubscription,
        instructor_name: input.instructorName || null,
        instructor_title: input.instructorTitle || null,
        instructor_bio: input.instructorBio || null,
        price: input.price,
        currency: "EGP",
        is_published: true,
      }),
    });
    const course = mapCourse(response.course);
    replaceCourse(course);
    return course;
  }

  async function updateCourse(courseId: string, patch: Partial<Course>) {
    const payload: JsonRecord = {};
    if (patch.title !== undefined) payload.title = patch.title;
    if (patch.subtitle !== undefined) payload.subtitle = patch.subtitle;
    if (patch.description !== undefined) payload.description = patch.description;
    if (patch.price !== undefined) payload.price = patch.price;
    if (patch.currency !== undefined) payload.currency = patch.currency;
    if (patch.requiresSubscription !== undefined) payload.requires_subscription = patch.requiresSubscription;
    if (patch.isPublished !== undefined) payload.is_published = patch.isPublished;
    if (patch.sortOrder !== undefined) payload.sort_order = patch.sortOrder;
    if (patch.instructor) {
      payload.instructor_name = patch.instructor.name;
      payload.instructor_title = patch.instructor.title;
      payload.instructor_bio = patch.instructor.bio;
    }
    const response = await apiRequest<{ course: JsonRecord }>(`/admin/courses/${courseId}`, {
      method: "PATCH",
      token: getAdminToken(),
      body: JSON.stringify(payload),
    });
    const updated = mapCourse(response.course);
    setCourses((current) =>
      current.map((course) => (course.id === courseId ? { ...course, ...updated, units: course.units } : course))
    );
  }

  async function deleteCourse(courseId: string) {
    await apiRequest(`/admin/courses/${courseId}`, { method: "DELETE", token: getAdminToken() });
    setCourses((current) => current.filter((course) => course.id !== courseId));
  }

  async function addUnit(courseId: string, title: string) {
    const response = await apiRequest<{ unit: JsonRecord }>(`/admin/courses/${courseId}/units`, {
      method: "POST",
      token: getAdminToken(),
      body: JSON.stringify({ title, is_published: true }),
    });
    const unit = mapUnit(response.unit);
    setCourses((current) => current.map((course) =>
      course.id === courseId ? { ...course, units: [...course.units, unit] } : course
    ));
  }

  async function updateUnit(courseId: string, unitId: string, title: string) {
    const response = await apiRequest<{ unit: JsonRecord }>(`/admin/courses/${courseId}/units/${unitId}`, {
      method: "PUT",
      token: getAdminToken(),
      body: JSON.stringify({ title }),
    });
    const unit = mapUnit(response.unit);
    setCourses((current) => current.map((course) => course.id === courseId ? {
      ...course,
      units: course.units.map((item) => item.id === unitId ? { ...item, ...unit, lessons: item.lessons } : item),
    } : course));
  }

  async function deleteUnit(courseId: string, unitId: string) {
    await apiRequest(`/admin/courses/${courseId}/units/${unitId}`, { method: "DELETE", token: getAdminToken() });
    setCourses((current) => current.map((course) =>
      course.id === courseId ? { ...course, units: course.units.filter((unit) => unit.id !== unitId) } : course
    ));
  }

  async function addLesson(courseId: string, unitId: string, lesson: Omit<Lesson, "id">) {
    const response = await apiRequest<{ lesson: JsonRecord }>(`/admin/units/${unitId}/lessons`, {
      method: "POST",
      token: getAdminToken(),
      body: lessonFormData(lesson, true),
    });
    const created = mapLesson(response.lesson);
    setCourses((current) => current.map((course) => course.id === courseId ? {
      ...course,
      units: course.units.map((unit) => unit.id === unitId ? { ...unit, lessons: [...unit.lessons, created] } : unit),
    } : course));
  }

  async function updateLesson(courseId: string, unitId: string, lessonId: string, patch: Partial<Lesson>) {
    const form = lessonFormData(patch);
    form.append("_method", "PUT");
    const response = await apiRequest<{ lesson: JsonRecord }>(`/admin/lessons/${lessonId}`, {
      method: "POST",
      token: getAdminToken(),
      body: form,
    });
    const updated = mapLesson(response.lesson);
    setCourses((current) => current.map((course) => course.id === courseId ? {
      ...course,
      units: course.units.map((unit) => unit.id === unitId ? {
        ...unit,
        lessons: unit.lessons.map((lesson) => lesson.id === lessonId ? updated : lesson),
      } : unit),
    } : course));
  }

  async function deleteLesson(courseId: string, unitId: string, lessonId: string) {
    await apiRequest(`/admin/lessons/${lessonId}`, { method: "DELETE", token: getAdminToken() });
    setCourses((current) => current.map((course) => course.id === courseId ? {
      ...course,
      units: course.units.map((unit) => unit.id === unitId ? {
        ...unit,
        lessons: unit.lessons.filter((lesson) => lesson.id !== lessonId),
      } : unit),
    } : course));
  }

  const value = useMemo<CoursesContextValue>(() => ({
    courses,
    loading,
    error,
    refreshCourses,
    loadCourse,
    loadAdminCourses,
    loadAdminCourse,
    addCourse,
    updateCourse,
    deleteCourse,
    addUnit,
    updateUnit,
    deleteUnit,
    addLesson,
    updateLesson,
    deleteLesson,
  }), [courses, loading, error, refreshCourses]);

  return <CoursesContext.Provider value={value}>{children}</CoursesContext.Provider>;
}

export function useCourses(): CoursesContextValue {
  const ctx = useContext(CoursesContext);
  if (!ctx) throw new Error("useCourses must be used within CoursesProvider");
  return ctx;
}
