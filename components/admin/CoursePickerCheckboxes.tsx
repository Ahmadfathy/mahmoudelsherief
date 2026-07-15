import type { Course } from "@/lib/academy-data";

export function CoursePickerCheckboxes({
  courses,
  selectedSlugs,
  onChange,
}: {
  courses: Course[];
  selectedSlugs: string[];
  onChange: (slugs: string[]) => void;
}) {
  function toggle(slug: string) {
    onChange(
      selectedSlugs.includes(slug)
        ? selectedSlugs.filter((s) => s !== slug)
        : [...selectedSlugs, slug]
    );
  }

  return (
    <div className="space-y-1.5">
      {courses.map((c) => (
        <label
          key={c.id}
          className="flex items-center gap-2 text-sm cursor-pointer select-none"
        >
          <input
            type="checkbox"
            checked={selectedSlugs.includes(c.slug)}
            onChange={() => toggle(c.slug)}
            className="w-4 h-4 accent-[var(--color-primary)]"
          />
          {c.title}
        </label>
      ))}
    </div>
  );
}
