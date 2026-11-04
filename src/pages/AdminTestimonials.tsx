import { AdminGuard } from "@/components/admin/AdminGuard";
import { TestimonialsPanel } from "@/components/admin/TestimonialsPanel";

export default function AdminTestimonials() {
  return <AdminGuard><TestimonialsPanel /></AdminGuard>;
}
