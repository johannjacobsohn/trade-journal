import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { createFileRoute } from '@tanstack/react-router';
import { Heading, Table, Flex } from '@radix-ui/themes';

export const Route = createFileRoute('/trades')({
  component: TradesPage,
})

export type Trade = {
  id: number;
  symbol: string;
  totalQuantity: number;
  avgPrice: number;
  realizedPnL: number;
  orders: string[];
};

export default function TradesPage() {
  const { t } = useTranslation();
  const { data, isLoading, error } = useQuery({
    queryKey: ['trades'],
    queryFn: async () => {
      const res = await fetch('/api/trades');
      if (!res.ok) throw new Error('Failed to fetch trades');
      return res.json();
    }
  });

  return (

    <Flex direction={'column'} gap="6">
      <Heading as="h1" size="8">{t('Trades')}</Heading>
      {isLoading && <div>{t('Loading Trades...')}</div>}
      {error && <div>{t('Error loading trades')}</div>}
      {data && (
        <Table.Root variant='surface' size="3">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>{t('Symbol')}</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>{t('Total Quantity')}</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>{t('Average Price')}</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>{t('Realized PnL')}</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>{t('Orders')}</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((trade: Trade) => (
              <Table.Row key={trade.id}>
                <Table.Cell>{trade.symbol}</Table.Cell>
                <Table.Cell>{trade.totalQuantity}</Table.Cell>
                <Table.Cell>{trade.avgPrice.toFixed(2)}</Table.Cell>
                <Table.Cell>{trade.realizedPnL.toFixed(2)}</Table.Cell>
                <Table.Cell>{trade.orders.join(', ')}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </Flex>
  );
}
