export type LessonResourceLink = {
  id?: string;
  label: string;
  url: string;
};

export type LessonResourceFile = {
  id?: string;
  label: string;
  url: string;
};

export type Lesson = {
  id: string;
  title: string;
  durationLabel?: string;
  durationSeconds?: number;
  videoType?: "youtube" | "vimeo" | "url" | "upload";
  videoUrl?: string;
  videoFile?: File;
  description?: string;
  links?: LessonResourceLink[];
  files?: LessonResourceFile[];
  isPreview?: boolean;
  isPublished?: boolean;
  sortOrder?: number;
};

export type Unit = {
  id: string;
  title: string;
  lessons: Lesson[];
  isPublished?: boolean;
  sortOrder?: number;
};

export type Instructor = {
  name: string;
  title: string;
  avatarUrl?: string;
  bio: string;
};

export type Course = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  coverImageUrl?: string;
  description?: string;
  price?: number;
  currency?: string;
  requiresSubscription: boolean;
  isPublished?: boolean;
  sortOrder?: number;
  unitsCount?: number;
  lessonsCount?: number;
  subscriptionsCount?: number;
  instructor: Instructor;
  units: Unit[];
};

