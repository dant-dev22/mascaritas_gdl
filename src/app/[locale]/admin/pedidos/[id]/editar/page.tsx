import { AdminOrderForm } from '@/components/admin/AdminOrderForm';
import { AdminShell } from '@/components/admin/AdminShell';

interface EditarPedidoPageProps {
  readonly params: Promise<{ readonly locale: string; readonly id: string }>;
}

// La ruta depende de un id arbitrario: no hay forma de prerenderizarla, así que
// se declara bloqueante (evita el error de prerenderizado con cacheComponents).
export const instant = false;

export default async function EditarPedidoPage({ params }: EditarPedidoPageProps) {
  const { id } = await params;

  return (
    <AdminShell>
      <AdminOrderForm orderId={id} />
    </AdminShell>
  );
}
