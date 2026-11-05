import { AdminShell } from '@/components/admin/AdminShell';
import { AdminProductList } from '@/components/admin/AdminProductList';

export default function AdminProductsPage() {
  return (
    <AdminShell>
      <AdminProductList />
    </AdminShell>
  );
}
