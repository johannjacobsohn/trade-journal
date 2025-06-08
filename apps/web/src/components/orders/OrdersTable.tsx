import React from 'react';
import { Table, Button, Popover, TextField, Flex, Box } from '@radix-ui/themes';
import { useState } from 'react';

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
    
  const [editForm, setEditForm] = useState<Order>({ id: 0, symbol: '', quantity: 0, price: 0, side: 'buy' });

  function handleEditInput(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    setEditForm(() => ({ ...editForm, [name]: value }));
  }
    

  function handleEditSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (onEdit) {
      onEdit(editForm);
    }
  }

  return (
    <Table.Root variant='surface' size="3">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Symbol</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Price</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Side</Table.ColumnHeaderCell>
          {(onEdit || onDelete) && <Table.ColumnHeaderCell>Aktion</Table.ColumnHeaderCell>}
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
                  }
                  }>
                    <Popover.Trigger>
                      <Button
                        color="blue"
                        variant="soft"
                        size="1"
                        onClick={() => onEdit(order)}
                        style={{ marginRight: 8 }}
                      >
                        Bearbeiten
                      </Button>
                    </Popover.Trigger>
                    <Popover.Content style={{ maxWidth: 400 }}>
                      Order bearbeiten
                      <form onSubmit={handleEditSubmit}>
                        <Flex direction="column" gap="3">
                          <TextField.Root
                            placeholder="Symbol"
                            name="symbol"
                            value={editForm.symbol}
                            onChange={handleEditInput}
                          />
                          <TextField.Root
                            placeholder="Menge"
                            name="quantity"
                            type="number"
                            value={editForm.quantity}
                            onChange={handleEditInput}
                          />
                          <TextField.Root
                            placeholder="Preis"
                            name="price"
                            type="number"
                            value={editForm.price}
                            onChange={handleEditInput}
                          />
                          <Box>
                            <select name="side" value={editForm.side} onChange={handleEditInput} style={{ width: '100%', padding: 8 }}>
                              <option value="buy">Buy</option>
                              <option value="sell">Sell</option>
                            </select>
                          </Box>
                          {/* {editError && <Box style={{ color: 'red' }}>{editError}</Box>} */}
                          <Button type="submit" loading={editOrderMutation?.isPending} disabled={editOrderMutation?.isPending}>
                            Speichern
                          </Button>
                        </Flex>

                      </form>
                      <Popover.Close>
                        <Button variant="soft" color="gray" mt="3" style={{ width: '100%' }}>Abbrechen</Button>
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
                    Löschen
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