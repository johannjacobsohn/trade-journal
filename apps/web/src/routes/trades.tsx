import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { createFileRoute } from '@tanstack/react-router';
import { Heading, Table, Flex } from '@radix-ui/themes';
import { useState } from 'react';
import { SortFilter } from '@/components/SortFilter';

export const Route = createFileRoute('/trades')({
  component: TradesPage,
})

interface Trade {
  id: number;
  symbol: string;
  totalQuantity: number;
  avgPrice: number;
  realizedPnL: number;
  orders: number[];
}

export default function TradesPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('');
  const [sortKey, setSortKey] = useState<'symbol'|'totalQuantity'|'avgPrice'|'realizedPnL'>('symbol');
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('asc');
  const { data, isLoading, error } = useQuery({
    queryKey: ['trades'],
    queryFn: async () => {
      const res = await fetch('/api/trades');
      if (!res.ok) throw new Error('Failed to fetch trades');
      return res.json();
    }
  });

  const filtered = (data as Trade[] | undefined)?.filter((trade) =>
    trade.symbol.toLowerCase().includes(filter.toLowerCase())
  ) ?? [];
  const sorted = [...filtered].sort((a, b) => {
    let v1 = a[sortKey], v2 = b[sortKey];
    if (typeof v1 === 'string') v1 = v1.toLowerCase();
    if (typeof v2 === 'string') v2 = v2.toLowerCase();
    if (v1 < v2) return sortDir === 'asc' ? -1 : 1;
    if (v1 > v2) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <Flex direction={'column'} gap="6">
      <Heading as="h1" size="8">{t('Trades')}</Heading>
      <SortFilter
        filterValue={filter}
        setFilterValue={setFilter}
        filterLabel={t('Filter by symbol')}
        sortKey={sortKey}
        setSortKey={setSortKey}
        sortDir={sortDir}
        setSortDir={setSortDir}
        sortOptions={[
          { value: 'symbol', label: 'Symbol' },
          { value: 'totalQuantity', label: 'Total Quantity' },
          { value: 'avgPrice', label: 'Average Price' },
          { value: 'realizedPnL', label: 'Realized PnL' },
        ]}
      />
      {isLoading && <div>{t('Loading Trades...')}</div>}
      {error && <div>{t('Error loading trades')}</div>}
      {sorted && (
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
            {sorted.map((trade) => (
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
