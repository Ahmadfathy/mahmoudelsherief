import { AdminGuard } from "@/components/admin/AdminGuard";
import { CoursesPanel } from "@/components/admin/CoursesPanel";

export default function AdminCourses() {
  return (
    <AdminGuard>
      <CoursesPanel />
    </AdminGuard>
  );
}
