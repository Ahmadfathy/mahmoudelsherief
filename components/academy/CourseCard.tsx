import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PlayCircle, Lock, BookOpen } from "lucide-react";
import type { Course } from "@/lib/academy-data";
import { useAuth } from "@/lib/auth-context";

export function CourseCard({ course, index = 0 }: { course: Course; index?: number }) {
  const { isSubscribed } = useAuth();
  const locked = course.requiresSubscription && !isSubscribed;
  const lessonCount = course.units.reduce((sum, u) => sum + u.lessons.length, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        to={`/academy/${course.slug}`}
        className="group block rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden hover:border-[var(--color-primary)] hover:-translate-y-1 transition-all duration-300"
      >
        <div className="relative aspect-video bg-[var(--color-subtle)] grid place-items-center overflow-hidden">
          {course.coverImageUrl ? (
            <img
              src={course.coverImageUrl}
              alt={course.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <BookOpen size={40} className="text-[var(--color-muted)]" strokeWidth={1.5} />
          )}

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 grid place-items-center">
            {locked ? (
              <span className="opacity-0 group-hover:opacity-100 transition-opacity grid place-items-center w-12 h-12 rounded-full bg-white/90">
                <Lock size={20} className="text-[#1A1A1A]" />
              </span>
            ) : (
              <span className="opacity-0 group-hover:opacity-100 transition-opacity grid place-items-center w-12 h-12 rounded-full bg-white/90">
                <PlayCircle size={22} className="text-[var(--color-primary)]" />
              </span>
            )}
          </div>

          {locked && (
            <span className="absolute top-3 end-3 flex items-center gap-1 bg-black/70 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              <Lock size={12} strokeWidth={2} />
              للمشتركين فقط
            </span>
          )}
        </div>

        <div className="p-5">
          <h3
            className="font-bold text-lg mb-1 line-clamp-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {course.title}
          </h3>
          <p className="text-sm text-[var(--color-muted)] line-clamp-2 mb-3">
            {course.subtitle}
          </p>
          <div className="flex items-center justify-between text-xs text-[var(--color-muted)]">
            <span>{course.instructor.name}</span>
            <span>{lessonCount} درس</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
