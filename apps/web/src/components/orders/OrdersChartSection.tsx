import { useQuery } from '@tanstack/react-query';
import { OrdersChart } from '@/components/orders/OrdersChart';
import { Card, Heading, Text, Skeleton, IconButton, Flex } from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';
import React from 'react';
import type { OrderChartData } from '@/components/orders/OrdersChart';
import { BiBarChart, BiLineChart } from 'react-icons/bi';

export const OrdersChartSection: React.FC = () => {
  const { t } = useTranslation();
  const { data, isLoading, error } = useQuery<OrderChartData[]>({
    queryKey: ['orders'],
    queryFn: async (): Promise<OrderChartData[]> => {
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error('Fehler beim Laden der Orders');
      const orders = await res.json();

      const grouped: Record<string, { buy: number; sell: number }> = {};
      for (const o of orders) {
        const date = o.date?.slice(0, 10) || 'unbekannt';
        if (!grouped[date]) grouped[date] = { buy: 0, sell: 0 };
        if (o.side === 'buy') grouped[date].buy += o.quantity;
        if (o.side === 'sell') grouped[date].sell += o.quantity;
      }
      return Object.entries(grouped)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, { buy, sell }]) => ({ date, buy, sell }));
    },
    initialData: [],
  });

  const [chartType, setChartType] = React.useState<'line' | 'bar'>('bar');

  return (
    <Card my="6" size="4">
      <Heading as="h2" size="6" mb="3">
        <Flex gap="4" align="center">
          {t('Order Chart')}
          <Flex gap="1">
            <IconButton variant='ghost' color={chartType === 'line' ? 'yellow' : 'gray'} onClick={() => setChartType('line')} aria-label={t('Line chart')}>
              <BiLineChart size="24" />
            </IconButton>
            <IconButton variant='ghost' color={chartType === 'bar' ? 'yellow' : 'gray'}  onClick={() => setChartType('bar')} aria-label={t('Bar chart')}>
              <BiBarChart size="24" />
            </IconButton>
          </Flex>
        </Flex>
      </Heading>
      {isLoading ? (
        <Skeleton height="300px" />
      ) : error ? (
        <Text color="red">{t('Error loading orders')}</Text>
      ) : (
        <OrdersChart data={data ?? []} chartType={chartType} />
      )}
    </Card>
  );
};
