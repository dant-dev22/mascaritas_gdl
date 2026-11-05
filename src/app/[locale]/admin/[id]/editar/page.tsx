import { AdminProductForm } from '@/components/admin/AdminProductForm';
import { AdminShell } from '@/components/admin/AdminShell';

interface EditarProductoPageProps {
  readonly params: Promise<{ readonly locale: string; readonly id: string }>;
}

// La ruta depende de un id arbitrario: no hay forma de prerenderizarla, así que
// se declara bloqueante (evita el error de prerenderizado con cacheComponents).
export const instant = false;

export default async function EditarProductoPage({ params }: EditarProductoPageProps) {
  const { id } = await params;

  return (
    <AdminShell>
      <AdminProductForm productId={id} />
    </AdminShell>
  );
}
