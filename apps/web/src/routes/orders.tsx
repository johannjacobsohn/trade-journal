import { createFileRoute } from '@tanstack/react-router'
import { OrdersTable } from '@/components/orders/OrdersTable';
import type { Order } from '@/components/orders/OrdersTable';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Flex, Popover, Heading, Skeleton } from '@radix-ui/themes';
import { OrdersForm } from '@/components/orders/OrdersForm';
import type { OrdersFormValues } from '@/components/orders/OrdersForm';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { OrdersTableFilterSort } from '@/components/orders/OrdersTableFilterSort';

export const Route = createFileRoute('/orders')({
  component: OrdersPage,
})

function OrdersPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [filterSymbol, setFilterSymbol] = React.useState('');
  const [filterSide, setFilterSide] = React.useState('');
  const [sortKey, setSortKey] = React.useState<'id' | 'symbol' | 'quantity' | 'price' | 'side'>('id');
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('asc');

  const { data: orders, isLoading, error } = useQuery<Order[]>({
    queryKey: ['orders', filterSymbol, filterSide, sortKey, sortDir],
    queryFn: async () => {
      const res = await fetch('/api/orders?symbol=' + encodeURIComponent(filterSymbol) +
        (filterSide ? `&side=${encodeURIComponent(filterSide)}` : '') +
        `&sort=${encodeURIComponent(`${sortKey}:${sortDir}`)}`);
      if (!res.ok) throw new Error('Fehler beim Laden der Orders');
      return res.json();
    },
  });

  // Dialog State
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState<OrdersFormValues>({ symbol: '', quantity: '', price: '', side: 'buy' });
  const [formError, setFormError] = React.useState<string | null>(null);
  const [deletingId, setDeletingId] = React.useState<number | null>(null);

  const addOrderMutation = useMutation({
    mutationFn: async (order: { symbol: string; quantity: number; price: number; side: 'buy' | 'sell' }) => {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });
      if (!res.ok) throw new Error('Fehler beim Anlegen der Order');
      return res.json();
    },
    onSuccess: () => {
      setOpen(false);
      setForm({ symbol: '', quantity: '', price: '', side: 'buy' });
      setFormError(null);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (err: unknown) => {
      setFormError(err instanceof Error ? err.message : 'Unbekannter Fehler');
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: async (id: number) => {
      setDeletingId(id);
      const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Fehler beim Löschen der Order');
      return res;
    },
    onSuccess: () => {
      setDeletingId(null);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: () => {
      setDeletingId(null);
    },
  });

  const editOrderMutation = useMutation({
    mutationFn: async (order: { id: number; symbol: string; quantity: number; price: number; side: 'buy' | 'sell' }) => {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: order.symbol, quantity: order.quantity, price: order.price, side: order.side }),
      });
      if (!res.ok) throw new Error('Fehler beim Bearbeiten der Order');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!form.symbol || !form.quantity || !form.price || !form.side) {
      setFormError(t('All fields are required!'));
      return;
    }
    addOrderMutation.mutate({
      symbol: form.symbol,
      quantity: Number(form.quantity),
      price: Number(form.price),
      side: form.side as 'buy' | 'sell',
    });
  }

  function handleDelete(id: number) {
    deleteOrderMutation.mutate(id);
  }

  function handleEditSubmit(editOrder: Order) {
    editOrderMutation.mutate({
      id: editOrder.id,
      symbol: editOrder.symbol,
      quantity: Number(editOrder.quantity),
      price: Number(editOrder.price),
      side: editOrder.side as 'buy' | 'sell',
    });
  }

  // if (isLoading) return <div>{t('Loading Orders...')}</div>;
  if (error) return <div style={{ color: 'red' }}>{t('Error')}: {(error as Error).message}</div>;

  return (
    <Flex direction={'column'} gap="6">
      <Flex justify="between" align="center">
        <Heading as="h1" size="8">{t('Orders')}</Heading>
        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger>
            <Button>{t('Add Order')}</Button>
          </Popover.Trigger>
          <Popover.Content style={{ maxWidth: 400 }}>
            {t('Create Order')}
            <OrdersForm
              values={form}
              onChange={setForm}
              onSubmit={handleSubmit}
              submitLabel={t('Submit')}
              loading={addOrderMutation.isPending}
              error={formError}
            />
            <Popover.Close>
              <Button variant="soft" color="gray" mt="3" style={{ width: '100%' }}>{t('Cancel')}</Button>
            </Popover.Close>
          </Popover.Content>
        </Popover.Root>
      </Flex>

      <OrdersTableFilterSort
        filterSymbol={filterSymbol}
        setFilterSymbol={setFilterSymbol}
        filterSide={filterSide}
        setFilterSide={setFilterSide}
        sortKey={sortKey}
        setSortKey={setSortKey}
        sortDir={sortDir}
        setSortDir={setSortDir}
      />
      
      <Skeleton loading={isLoading}>
        <OrdersTable orders={orders ?? []} onDelete={handleDelete} deletingId={deletingId} onEdit={handleEditSubmit} />
      </Skeleton>
    </Flex>
  );
}
