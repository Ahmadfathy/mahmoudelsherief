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

const STORAGE_KEY = "academy-subscribers-v1";

export function readSubscribers(): Subscriber[] {
  return readJson<Subscriber[]>(STORAGE_KEY, []);
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
  const { value: subscribers, update } = useLocalStore<Subscriber[]>(STORAGE_KEY, []);

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
