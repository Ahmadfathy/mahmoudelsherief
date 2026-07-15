import { AdminGuard } from "@/components/admin/AdminGuard";
import { SubscribersPanel } from "@/components/admin/SubscribersPanel";

export default function AdminSubscribers() {
  return (
    <AdminGuard>
      <SubscribersPanel />
    </AdminGuard>
  );
}
