import { createFileRoute } from '@tanstack/react-router'
import { Card, Heading, Text } from '@radix-ui/themes'
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { t } = useTranslation()
  return (
    <>
      <Heading as="h1" size="8">{t("Home")}</Heading>
      <Card mt="6" size="4">
        <Heading as="h2" size="6" mb="3">{t("Welcome to the Trade Journal")}</Heading>
        <Text>
          {t("This is a simple application to track your trades. You can add, edit, and delete trades, and view your trading history. Feel free to explore the application and start tracking your trades!")}
        </Text>
      </Card>
    </>
  )
}
