import { AdminOrderList } from '@/components/admin/AdminOrderList';
import { AdminShell } from '@/components/admin/AdminShell';

export default function AdminOrdersPage() {
  return (
    <AdminShell>
      <AdminOrderList />
    </AdminShell>
  );
}
