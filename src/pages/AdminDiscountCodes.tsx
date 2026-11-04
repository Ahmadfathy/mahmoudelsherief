import { AdminGuard } from "@/components/admin/AdminGuard";
import { DiscountCodesPanel } from "@/components/admin/DiscountCodesPanel";

export default function AdminDiscountCodes() {
  return <AdminGuard><DiscountCodesPanel /></AdminGuard>;
}
