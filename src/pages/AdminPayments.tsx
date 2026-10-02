import { AdminGuard } from "@/components/admin/AdminGuard";
import { PaymentsPanel } from "@/components/admin/PaymentsPanel";

export default function AdminPayments() {
  return <AdminGuard><PaymentsPanel /></AdminGuard>;
}

