import { useState } from "react";
import { CheckCircle2, XCircle, Trash2 } from "lucide-react";
import { useSubscribers, type Subscriber, type SubscriberStatus } from "@/lib/subscribers-store";
import { useCourses } from "@/lib/courses-store";
import { CoursePickerCheckboxes } from "./CoursePickerCheckboxes";

const STATUS_LABEL: Record<SubscriberStatus, string> = {
  pending: "قيد المراجعة",
  approved: "مفعّل",
  rejected: "مرفوض",
};

const STATUS_STYLE: Record<SubscriberStatus, string> = {
  pending: "bg-[var(--color-secondary)]/20 text-[var(--color-secondary-warm)]",
  approved: "bg-green-500/15 text-green-500",
  rejected: "bg-red-500/15 text-red-500",
};

export function SubscribersPanel() {
  const { subscribers, approveSubscriber, rejectSubscriber, setApprovedCourses, deleteSubscriber } =
    useSubscribers();
  const { courses } = useCourses();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pickerSlugs, setPickerSlugs] = useState<string[]>([]);
  const [filter, setFilter] = useState<SubscriberStatus | "all">("pending");

  function startEditing(sub: Subscriber) {
    setEditingId(sub.id);
    setPickerSlugs(
      sub.approvedCourseSlugs.length > 0
        ? sub.approvedCourseSlugs
        : sub.interestedCourseSlug
        ? [sub.interestedCourseSlug]
        : []
    );
  }

  function confirmApprove(id: string) {
    approveSubscriber(id, pickerSlugs);
    setEditingId(null);
  }

  const filtered =
    filter === "all" ? subscribers : subscribers.filter((s) => s.status === filter);

  const counts = {
    pending: subscribers.filter((s) => s.status === "pending").length,
    approved: subscribers.filter((s) => s.status === "approved").length,
    rejected: subscribers.filter((s) => s.status === "rejected").length,
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-5">
        {(["pending", "approved", "rejected", "all"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`h-9 px-4 rounded-full text-sm font-bold transition-colors ${
              filter === f
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--color-subtle)] text-[var(--color-fg)] hover:bg-[var(--color-border)]"
            }`}
          >
            {f === "all" ? "الكل" : STATUS_LABEL[f]}
            {f !== "all" && ` (${counts[f]})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-[var(--color-muted)] text-sm">مفيش طلبات هنا.</p>
      )}

      <div className="space-y-3">
        {filtered.map((sub) => {
          const interestedCourse = courses.find((c) => c.slug === sub.interestedCourseSlug);
          return (
            <div
              key={sub.id}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold">{sub.name}</p>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_STYLE[sub.status]}`}
                    >
                      {STATUS_LABEL[sub.status]}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-muted)]">{sub.email}</p>
                  {sub.phone && <p className="text-sm text-[var(--color-muted)]">{sub.phone}</p>}
                  {interestedCourse && (
                    <p className="text-xs text-[var(--color-muted)] mt-1">
                      طلب اشتراك في: {interestedCourse.title}
                    </p>
                  )}
                  {sub.approvedCourseSlugs.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {sub.approvedCourseSlugs.map((slug) => {
                        const c = courses.find((c) => c.slug === slug);
                        return (
                          <span
                            key={slug}
                            className="text-xs bg-[var(--color-subtle)] px-2 py-0.5 rounded-full"
                          >
                            {c?.title ?? slug}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => startEditing(sub)}
                    className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-green-500/10 text-green-500 text-sm font-bold hover:bg-green-500/20 transition-colors"
                  >
                    <CheckCircle2 size={15} />
                    {sub.status === "approved" ? "تعديل الصلاحيات" : "تفعيل"}
                  </button>
                  {sub.status !== "rejected" && (
                    <button
                      type="button"
                      onClick={() => rejectSubscriber(sub.id)}
                      className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-red-500/10 text-red-500 text-sm font-bold hover:bg-red-500/20 transition-colors"
                    >
                      <XCircle size={15} />
                      رفض
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteSubscriber(sub.id)}
                    aria-label="حذف الطلب"
                    className="grid place-items-center w-9 h-9 rounded-full text-[var(--color-muted)] hover:bg-[var(--color-subtle)] hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {editingId === sub.id && (
                <div className="mt-4 pt-4 border-t border-dashed border-[var(--color-border)]">
                  <p className="text-sm font-bold mb-2">الكورسات المفعّلة لـ {sub.name}</p>
                  <CoursePickerCheckboxes
                    courses={courses}
                    selectedSlugs={pickerSlugs}
                    onChange={setPickerSlugs}
                  />
                  <div className="flex gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (sub.status === "approved") {
                          setApprovedCourses(sub.id, pickerSlugs);
                        } else {
                          confirmApprove(sub.id);
                        }
                        setEditingId(null);
                      }}
                      className="h-9 px-4 rounded-full bg-[var(--color-primary)] text-white text-sm font-bold hover:opacity-90 transition-opacity"
                    >
                      حفظ
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="h-9 px-4 rounded-full bg-[var(--color-subtle)] text-sm font-bold hover:bg-[var(--color-border)] transition-colors"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
