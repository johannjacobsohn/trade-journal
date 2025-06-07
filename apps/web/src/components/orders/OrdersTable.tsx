import React from 'react';
import { Table } from '@radix-ui/themes';

export type Order = {
  id: number;
  symbol: string;
  quantity: number;
  price: number;
  side: 'buy' | 'sell';
};

interface OrdersTableProps {
  orders: Order[];
}

export const OrdersTable: React.FC<OrdersTableProps> = ({ orders }) => (
  <Table.Root>
    <Table.Header>
      <Table.Row>
        <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
        <Table.ColumnHeaderCell>Symbol</Table.ColumnHeaderCell>
        <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
        <Table.ColumnHeaderCell>Price</Table.ColumnHeaderCell>
        <Table.ColumnHeaderCell>Side</Table.ColumnHeaderCell>
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
        </Table.Row>
      ))}
    </Table.Body>
  </Table.Root>
);
