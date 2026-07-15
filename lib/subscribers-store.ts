import { readJson, writeJson, useLocalStore } from "@/lib/local-store";

// تخزين طلبات الاشتراك محلياً (mock) لحد ما يتحط backend حقيقي.
// تحذير: كلمة السر بتتخزن نص صريح هنا للتجربة بس — ممنوع ده ينزل production
// من غير ما يتحط تشفير حقيقي وسيرفر فعلي للتحقق.

export type SubscriberStatus = "pending" | "approved" | "rejected";

export type Subscriber = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password: string;
  interestedCourseSlug?: string;
  status: SubscriberStatus;
  approvedCourseSlugs: string[];
  createdAt: string;
};

const STORAGE_KEY = "academy-subscribers-v2";

// بيانات وهمية (seed) بتتحمل أول مرة بس عشان الجدول ميبقاش فاضي — بتتحل محل
// بيانات حقيقية أول ما مشتركين فعليين يسجلوا.
const seedSubscribers: Subscriber[] = [
  {
    id: "seed-sub-1",
    name: "سارة أحمد",
    email: "sara@example.com",
    phone: "01011112222",
    password: "demo1234",
    interestedCourseSlug: "photography-101",
    status: "pending",
    approvedCourseSlugs: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: "seed-sub-2",
    name: "مصطفى عادل",
    email: "mostafa@example.com",
    phone: "01022223333",
    password: "demo1234",
    interestedCourseSlug: "photography-101",
    status: "approved",
    approvedCourseSlugs: ["photography-101"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: "seed-sub-3",
    name: "نورهان يوسف",
    email: "nourhan@example.com",
    password: "demo1234",
    interestedCourseSlug: "photography-101",
    status: "rejected",
    approvedCourseSlugs: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: "seed-sub-4",
    name: "عمر خالد",
    email: "omar@example.com",
    phone: "01055556666",
    password: "demo1234",
    interestedCourseSlug: "photography-101",
    status: "pending",
    approvedCourseSlugs: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
];

export function readSubscribers(): Subscriber[] {
  return readJson<Subscriber[]>(STORAGE_KEY, seedSubscribers);
}

function writeSubscribers(subscribers: Subscriber[]) {
  writeJson(STORAGE_KEY, subscribers);
}

export function registerSubscriber(input: {
  name: string;
  email: string;
  phone?: string;
  password: string;
  interestedCourseSlug?: string;
}): { ok: true } | { ok: false; reason: "duplicate" } {
  const subscribers = readSubscribers();
  const normalizedEmail = input.email.trim().toLowerCase();

  if (subscribers.some((s) => s.email.toLowerCase() === normalizedEmail)) {
    return { ok: false, reason: "duplicate" };
  }

  const subscriber: Subscriber = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    email: normalizedEmail,
    phone: input.phone?.trim() || undefined,
    password: input.password,
    interestedCourseSlug: input.interestedCourseSlug,
    status: "pending",
    approvedCourseSlugs: [],
    createdAt: new Date().toISOString(),
  };

  writeSubscribers([...subscribers, subscriber]);
  return { ok: true };
}

export function useSubscribers() {
  const { value: subscribers, update } = useLocalStore<Subscriber[]>(STORAGE_KEY, seedSubscribers);

  function approveSubscriber(id: string, courseSlugs: string[]) {
    update((subs) =>
      subs.map((s) =>
        s.id === id ? { ...s, status: "approved", approvedCourseSlugs: courseSlugs } : s
      )
    );
  }

  function rejectSubscriber(id: string) {
    update((subs) =>
      subs.map((s) => (s.id === id ? { ...s, status: "rejected", approvedCourseSlugs: [] } : s))
    );
  }

  function setApprovedCourses(id: string, courseSlugs: string[]) {
    update((subs) =>
      subs.map((s) => (s.id === id ? { ...s, approvedCourseSlugs: courseSlugs } : s))
    );
  }

  function deleteSubscriber(id: string) {
    update((subs) => subs.filter((s) => s.id !== id));
  }

  return { subscribers, approveSubscriber, rejectSubscriber, setApprovedCourses, deleteSubscriber };
}
