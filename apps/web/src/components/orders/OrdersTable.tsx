import React from 'react';
import { Table, Button, Popover } from '@radix-ui/themes';
import { useState } from 'react';
import { OrdersForm } from './OrdersForm';
import { useTranslation } from 'react-i18next';
import type { OrdersFormValues } from './OrdersForm';

export type Order = {
  id: number;
  symbol: string;
  quantity: number;
  price: number;
  side: 'buy' | 'sell';
};

interface OrdersTableProps {
  orders: Order[];
  onDelete?: (id: number) => void;
  deletingId?: number | null;
  onEdit?: (order: Order) => void;
  editOrderMutation?: { isPending: boolean };
}

export const OrdersTable: React.FC<OrdersTableProps> = ({ orders, onDelete, deletingId, onEdit, editOrderMutation }) =>{ 
  const { t } = useTranslation();

  const [editForm, setEditForm] = useState<Order>({ id: 0, symbol: '', quantity: 0, price: 0, side: 'buy' });
  const [editError, setEditError] = useState<string | null>(null);

  function handleEditInput(value: OrdersFormValues) {
    setEditForm((prev) => ({
      ...prev,
      ...value,
      id: prev.id,
      quantity: Number(value.quantity),
      price: Number(value.price),
    }));
  }

  function handleEditSubmit(event: React.FormEvent) {
    event.preventDefault();

    setEditError(null);
    if (!editForm.symbol || !editForm.quantity || !editForm.price || !editForm.side) {
      setEditError('Alle Felder sind Pflichtfelder!');
      return;
    }

    if (onEdit) {
      onEdit(editForm);
    }
  }

  return (
    <Table.Root variant='surface' size="3">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>{t('ID')}</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>{t('Symbol')}</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>{t('Quantity')}</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>{t('Price')}</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>{t('Side')}</Table.ColumnHeaderCell>
          {(onEdit || onDelete) && <Table.ColumnHeaderCell>{t('Action')}</Table.ColumnHeaderCell>}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {orders.map(order => (
          <Table.Row key={order.id}>
            <Table.Cell>{order.id}</Table.Cell>
            <Table.Cell>{order.symbol}</Table.Cell>
            <Table.Cell>{order.quantity}</Table.Cell>
            <Table.Cell>{order.price}</Table.Cell>
            <Table.Cell>{order.side}</Table.Cell>
            {(onEdit || onDelete) && (
              <Table.Cell>
                {onEdit && (
                  <Popover.Root onOpenChange={() => {
                    setEditForm({ ...order });
                  }}>
                    <Popover.Trigger>
                      <Button
                        color="blue"
                        variant="soft"
                        size="1"
                        style={{ marginRight: 8 }}
                      >
                        {t('Edit')}
                      </Button>
                    </Popover.Trigger>
                    <Popover.Content style={{ maxWidth: 400 }}>
                      {t('Edit Order')}
                      <OrdersForm 
                        values={editForm}
                        onSubmit={handleEditSubmit}
                        onChange={handleEditInput}
                        submitLabel={t('Save')}
                        loading={editOrderMutation?.isPending || false}
                        disabled={editOrderMutation?.isPending || false}
                        error={editError}
                      />

                      <Popover.Close>
                        <Button variant="soft" color="gray" mt="3" style={{ width: '100%' }}>{t('Cancel')}</Button>
                      </Popover.Close>
                    </Popover.Content>
                  </Popover.Root>
                )}
                {onDelete && (
                  <Button
                    color="red"
                    variant="soft"
                    size="1"
                    onClick={() => onDelete(order.id)}
                    loading={deletingId === order.id}
                    disabled={deletingId === order.id}
                  >
                    {t('Delete')}
                  </Button>
                )}
              </Table.Cell>
            )}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}