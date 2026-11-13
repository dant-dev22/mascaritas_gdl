import { AdminOrderForm } from '@/components/admin/AdminOrderForm';
import { AdminShell } from '@/components/admin/AdminShell';

export default function NuevoPedidoPage() {
  return (
    <AdminShell>
      <AdminOrderForm />
    </AdminShell>
  );
}
