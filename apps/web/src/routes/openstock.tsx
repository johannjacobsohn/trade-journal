import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { createFileRoute } from '@tanstack/react-router';
import { Table, Heading, Flex } from '@radix-ui/themes';
import { useState } from 'react';
import { SortFilter } from '@/components/SortFilter';

export const Route = createFileRoute('/openstock')({
  component: OpenStockPage,
})

interface OpenStock {
  symbol: string;
  shares: number;
  invested: number;
}

function OpenStockPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('');
  const [sortKey, setSortKey] = useState<'symbol'|'shares'|'invested'>('symbol');
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('asc');
  const { data, isLoading, error } = useQuery({
    queryKey: ['openstock'],
    queryFn: async () => {
      const res = await fetch('/api/openstock');
      if (!res.ok) throw new Error('Failed to fetch open stock');
      return res.json();
    }
  });

  const filtered = (data as OpenStock[] | undefined)?.filter((pos) =>
    pos.symbol.toLowerCase().includes(filter.toLowerCase())
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
      <Heading as="h1" size="8">{t('Open Stock Positions')}</Heading>
      <div style={{display:'flex',gap:8,marginBottom:16}}>
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
            { value: 'shares', label: 'Shares' },
            { value: 'invested', label: 'Invested Capital' },
          ]}
        />
      </div>
      {isLoading && <div>{t('Loading Open Stock...')}</div>}
      {error && <div>{t('Error loading open stock')}</div>}
      {sorted && (
        <Table.Root variant='surface' size="3">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>{t('Symbol')}</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>{t('Shares')}</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>{t('Invested Capital')}</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {sorted.map((pos) => (
              <Table.Row key={pos.symbol}>
                <Table.Cell>{pos.symbol}</Table.Cell>
                <Table.Cell>{pos.shares}</Table.Cell>
                <Table.Cell>{pos.invested.toFixed(2)}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </Flex>
  );
}

export default OpenStockPage;
