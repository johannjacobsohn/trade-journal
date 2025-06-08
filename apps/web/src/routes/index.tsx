import { createFileRoute } from '@tanstack/react-router'
import { Card, Heading, Text, Button } from '@radix-ui/themes'
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { t } = useTranslation()
  const queryClient = useQueryClient();
  const importMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/orders/import-dummy', { method: 'POST' });
      if (!res.ok) throw new Error('Import failed');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    }
  });

  return (
    <>
      <Heading as="h1" size="8">{t("Home")}</Heading>
      <Card mt="6" size="4">
        <Heading as="h2" size="6" mb="3">{t("Welcome to the Trade Journal")}</Heading>
        <Text>
          {t("This is a simple application to track your trades. You can add, edit, and delete trades, and view your trading history. Feel free to explore the application and start tracking your trades!")}
        </Text>
      </Card>

      <Card mt="6" size="4">
        <Heading as="h2" size="6" mb="3">{t("Development")}</Heading>
        <Button onClick={() => importMutation.mutate()} disabled={importMutation.isPending}>
          {importMutation.isPending ? t('Importing...') : t('Import Dummy Data')}
        </Button>
      </Card>
    </>
  )
}
