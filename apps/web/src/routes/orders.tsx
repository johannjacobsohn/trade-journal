import { createFileRoute } from '@tanstack/react-router'
import { OrdersTable } from '@/components/orders/OrdersTable';
import type { Order } from '@/components/orders/OrdersTable';
import { useQuery } from '@tanstack/react-query';

export const Route = createFileRoute('/orders')({
  component: OrdersPage,
})

function OrdersPage() {
  const { data: orders, isLoading, error } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error('Fehler beim Laden der Orders');
      return res.json();
    },
  });

  if (isLoading) return <div>Lade Bestellungen...</div>;
  if (error) return <div style={{ color: 'red' }}>Fehler: {(error as Error).message}</div>;

  return (
    <div>
      <h1>Orders</h1>
      <OrdersTable orders={orders ?? []} />
    </div>
  );
}
