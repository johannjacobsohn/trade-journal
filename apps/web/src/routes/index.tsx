import { createFileRoute } from '@tanstack/react-router'
import { Card, Heading, Text, Button, Flex, Grid } from '@radix-ui/themes'
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Link } from '@/components/link'
import { HiOutlineArrowRight } from 'react-icons/hi';
import { OrdersChartSection } from '@/components/orders/OrdersChartSection';


export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { t } = useTranslation()
  const queryClient = useQueryClient();
  const importMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/dev/import-dummy', { method: 'POST' });
      if (!res.ok) throw new Error('Import failed');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    }
  });


  const emptyDbMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/dev/empty-db', { method: 'POST' });
      if (!res.ok) throw new Error('Empty DB failed');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    }
  });


  const { data } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const res = await fetch('/api/analytics');
      if (!res.ok) throw new Error('Fehler beim Laden der Analytics');
      return res.json();
    }
  });


  return (
    <>
      <Heading as="h1" size="8">{t("Home")}</Heading>
      <Card my="6" size="4">
        <Heading as="h2" size="6" mb="3">{t("Welcome to the Trade Journal")}</Heading>
        <Text>
          {t("This is a simple application to track your trades. You can add, edit, and delete trades, and view your trading history. Feel free to explore the application and start tracking your trades!")}
        </Text>
      </Card>

      <OrdersChartSection />

      <Heading as="h1" size="8" asChild>
        <Flex align="center" gap="2">
          {t("Analytics")}
          <Link to="/analytics">
            <HiOutlineArrowRight style={{ verticalAlign: 'middle' }} aria-hidden="true" focusable="false" size={16} />
          </Link>
        </Flex>
      </Heading>

      <Grid my="6" columns={{ 'md': "2", 'lg': "3" }} gap="4">
        <Card size="3">
          <Flex direction="column" gap="4" align="center">
            <Text size="9">{data?.completedTrades}</Text>
            <Flex gap="2">
              <Text color='gray'>{t('Completed Trades')}</Text>
              <Link to="/trades">
                <HiOutlineArrowRight style={{ verticalAlign: 'middle' }} aria-hidden="true" focusable="false" size={16} />
              </Link>
            </Flex>
          </Flex>
        </Card>
        <Card size="3">
          <Flex direction="column" gap="4" align="center">
            <Text size="9">{data?.winRate ? (data.winRate * 100).toFixed(1) : '0'}</Text>
            <Text color='gray'>{t('Win Rate')}</Text>
          </Flex>
        </Card>
        <Card size="3">
          <Flex direction="column" gap="4" align="center">
            <Text size="9">{data?.profitFactor ? data.profitFactor.toFixed(2) : '0.00'}</Text>
            <Text color='gray'>{t('Profit Factor')}</Text>
          </Flex>
        </Card>
        <Card size="3">
          <Flex direction="column" gap="4" align="center">
            <Text size="9">{data?.avgWin ? data.avgWin.toFixed(2) : '0.00'}</Text>
            <Text color='gray'>{t('Average Win')}</Text>
          </Flex>
        </Card>
        <Card size="3">
          <Flex direction="column" gap="4" align="center">
            <Text size="9">{data?.avgLoss ? data.avgLoss.toFixed(2) : '0.00'}</Text>
            <Text color='gray'>{t('Average Loss')}</Text>
          </Flex>
        </Card>
        <Card size="3">
          <Flex direction="column" gap="4" align="center">
            <Text size="9">{data?.avgHoldDurationDays ? data.avgHoldDurationDays.toFixed(2) : '0.00'}</Text>
            <Text color='gray'>{t('Average Hold Duration')} ({t('days')})</Text>
          </Flex>
        </Card>
      </Grid>

      <Heading as="h1" size="8">{t("Sections")}</Heading>

      <Grid mt="6" columns={{ 'md': "2", 'lg': "3" }} gap="4">
        <Card size="4">
          <Flex direction="column" gap="2">
            <Heading as="h2" size="6" mb="3">{t("Orders")}</Heading>
            <Text>{t("Manage your orders here. You can add, edit, and delete orders.")}</Text>
            <Button asChild>
              <Link to="/orders">{t("Go to Orders")}</Link>
            </Button>
          </Flex>
        </Card>
        <Card size="4">
          <Flex direction="column" gap="2">
            <Heading as="h2" size="6" mb="3">{t("Trades")}</Heading>
            <Text>{t("View and manage your trades. You can add, edit, and delete trades.")}</Text>
            <Button asChild>
              <Link to="/trades">{t("Go to Trades")}</Link>
            </Button>
          </Flex>
        </Card>
        <Card size="4">
          <Flex direction="column" gap="2">

            <Heading as="h2" size="6" mb="3">{t("Open Positions")}</Heading>
            <Text>{t("View your Open Positions and their current status.")}</Text>
            <Button asChild>
              <Link to="/openstock">{t("Go to Open Positions")}</Link>
            </Button>
          </Flex>
        </Card>
        <Card size="4">
          <Flex direction="column" gap="2">

            <Heading as="h2" size="6" mb="3">{t("Depot")}</Heading>
            <Text>{t("View your depot and its current status.")}</Text>
            <Button asChild>
              <Link to="/depot">{t("Go to Depot")}</Link>
            </Button>
          </Flex>
        </Card>
        <Card size="4">
          <Flex direction="column" gap="2">

            <Heading as="h2" size="6" mb="3">{t("Analytics")}</Heading>
            <Text>{t("View your trading analytics and performance metrics.")}</Text>
            <Button asChild>
              <Link to="/analytics">{t("Go to Analytics")}</Link>
            </Button>
          </Flex>
        </Card>
      </Grid>


      <Card mt="6" size="4">
        <Heading as="h2" size="6" mb="3">{t("Development")}</Heading>
        <Flex gap="2">
          <Button onClick={() => importMutation.mutate()} disabled={importMutation.isPending}>
            {importMutation.isPending ? t('Importing...') : t('Import Dummy Data')}
          </Button>
          <Button color="red" onClick={() => emptyDbMutation.mutate()} disabled={emptyDbMutation.isPending}>
            {emptyDbMutation.isPending ? t('Emptying...') : t('Empty Database')}
          </Button>
        </Flex>
      </Card>
    </>
  )
}
