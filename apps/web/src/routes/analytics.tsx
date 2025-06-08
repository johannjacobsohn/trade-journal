import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Heading, Card, Flex, Text } from '@radix-ui/themes';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/analytics')({
  component: AnalyticsPage,
})

function AnalyticsPage() {
  const { t } = useTranslation();
  const { data, isLoading, error } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const res = await fetch('/api/analytics');
      if (!res.ok) throw new Error('Fehler beim Laden der Analytics');
      return res.json();
    }
  });

  return (
    <Flex direction="column" gap="6" style={{ maxWidth: 600 }}>
      <Heading as="h1" size="8">{t('Analytics')}</Heading>
      {isLoading ? (
        <div>{t('Loading Analytics...')}</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{t('Error loading analytics')}</div>
      ) : data ? (
        <Card>
          <Flex direction="column" gap="4">
            <Flex justify="between"><Text>{t('Completed Trades')}</Text><Text>{data.completedTrades}</Text></Flex>
            <Flex justify="between"><Text>{t('Win Rate')}</Text><Text>{(data.winRate * 100).toFixed(1)}%</Text></Flex>
            <Flex justify="between"><Text>{t('Profit Factor')}</Text><Text>{data.profitFactor.toFixed(2)}</Text></Flex>
            <Flex justify="between"><Text>{t('Average Win')}</Text><Text>{data.avgWin.toFixed(2)}</Text></Flex>
            <Flex justify="between"><Text>{t('Average Loss')}</Text><Text>{data.avgLoss.toFixed(2)}</Text></Flex>
            <Flex justify="between"><Text>{t('Average Hold Duration')}</Text><Text>{data.avgHoldDurationDays.toFixed(2)} {t('days')}</Text></Flex>
          </Flex>
        </Card>
      ) : null}
    </Flex>
  );
}
