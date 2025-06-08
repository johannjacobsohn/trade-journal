import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { createFileRoute } from '@tanstack/react-router';
import { Heading, Table, Flex } from '@radix-ui/themes';
import { useState, useEffect } from 'react';
import { SortFilter } from '@/components/SortFilter';
import { Popover, IconButton, TextField, Button } from '@radix-ui/themes';
import { FiEdit2 } from 'react-icons/fi';

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

interface TradeMeta {
  symbol: string;
  notes?: string;
}

export default function TradesPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('');
  const [sortKey, setSortKey] = useState<'symbol'|'totalQuantity'|'avgPrice'|'realizedPnL'>('symbol');
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('asc');
  const { data, isLoading, error } = useQuery<Trade[]>({
    queryKey: ['trades'],
    queryFn: async () => {
      const res = await fetch('/api/trades');
      if (!res.ok) throw new Error('Failed to fetch trades');
      return res.json();
    }
  });
  const [tradeMeta, setTradeMeta] = useState<Record<string, TradeMeta>>({});
  const [editingNotes, setEditingNotes] = useState<string>('');

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

  useEffect(() => {
    console.log('data', data);
    if (!data || !data.length) return;
    Promise.all(data.map(trade =>
      fetch(`/api/trades/meta/${encodeURIComponent(trade.symbol)}`)
        .then(r => r.ok ? r.json() : { symbol: trade.symbol, notes: '' })
    )).then(arr => {
      const meta: Record<string, TradeMeta> = {};
      arr.forEach((m: TradeMeta) => { meta[m.symbol] = m; });
      setTradeMeta(meta);
    });
  }, [data]);

  async function handleEditNotes(symbol: string, notes: string) {
    await fetch(`/api/trades/meta/${encodeURIComponent(symbol)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes })
    });
    setTradeMeta(m => ({ ...m, [symbol]: { symbol, notes } }));
  }

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
              <Table.ColumnHeaderCell>{t('Notes')}</Table.ColumnHeaderCell>
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
                <Table.Cell>
                  <Flex gap="2" align="start" justify={'between'}>
                    {tradeMeta[trade.symbol]?.notes || t('No notes')}
                    <Popover.Root onOpenChange={() => {
                      setEditingNotes(tradeMeta[trade.symbol]?.notes || '');
                    }}>
                      <Popover.Trigger>
                        <IconButton variant="ghost" size="4">
                          <FiEdit2 />
                        </IconButton>
                      </Popover.Trigger>
                      <Popover.Content>
                        <form onSubmit={e => { e.preventDefault(); handleEditNotes(trade.symbol, editingNotes); }}>
                          <TextField.Root
                            value={editingNotes}
                            defaultValue={tradeMeta[trade.symbol]?.notes || ''}
                            onChange={e => setEditingNotes(e.target.value)}
                            placeholder={t('Notes')}
                            style={{ minWidth: 180 }}
                          />
                          <Flex gap="2" mt="2">
                            <Button type="submit" mt="3" style={{ width: '100%' }}>{t('Save')}</Button>
                          </Flex>
                        </form>
                        <Popover.Close> 
                          <Button variant="soft" color="gray" mt="3" style={{ width: '100%' }}>{t('Cancel')}</Button>
                        </Popover.Close>
                      </Popover.Content>
                    </Popover.Root>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </Flex>
  );
}
