import { useQuery } from '@tanstack/react-query';
import { Card, Heading, Flex, Text, Skeleton } from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { Link } from '@/components/link';
import { HiOutlineArrowRight } from 'react-icons/hi';

export const DepotOverviewCard: React.FC = () => {
  const { t } = useTranslation();
  const { data: depot, isLoading: depotLoading, error: depotError } = useQuery({
    queryKey: ['depot'],
    queryFn: async () => {
      const res = await fetch('/api/depot');
      if (!res.ok) throw new Error('Fehler beim Laden des Depotwerts');
      return res.json();
    }
  });
  const { data: openstock, isLoading: openstockLoading, error: openstockError } = useQuery({
    queryKey: ['openstock'],
    queryFn: async () => {
      const res = await fetch('/api/openstock');
      if (!res.ok) throw new Error('Fehler beim Laden der offenen Positionen');
      return res.json();
    }
  });

  const invested = Array.isArray(openstock)
    ? openstock.reduce((sum, pos) => sum + (pos.invested || 0), 0)
    : 0;

  return (
    <Card size="5" style={{ marginBottom: 32 }}>
      <Flex direction="column" gap="4">
        <Heading as="h2" size="6">{t('Depot Overview')}</Heading>
        {(depotLoading || openstockLoading) ? (
          <Skeleton height="60px" />
        ) : (depotError || openstockError) ? (
          <Text color="red">{t('Error loading depot')}</Text>
        ) : (
          <Flex gap="4" align="center" direction={{ initial: 'column', md: 'row'}}>
            <Text size="9">{(depot.value + invested).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</Text>
            <Flex direction="column" gap="2" ml="4">
              <Flex gap="2" align="center">
                <Text size="6">
                  {t('Depot Value')}: {depot.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                </Text>
                <Link to="/depot">
                  <HiOutlineArrowRight style={{ verticalAlign: 'middle' }} aria-hidden="true" focusable="false" size={16} />
                </Link>
              </Flex>
              <Flex gap="2" align="center">
                <Text size="6">{t('Invested Capital in Open Positions')}: {invested.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</Text>
                <Link to="/openstock">
                  <HiOutlineArrowRight style={{ verticalAlign: 'middle' }} aria-hidden="true" focusable="false" size={16} />
                </Link>
              </Flex>
            </Flex>
          </Flex>
        )}
      </Flex>
    </Card>
  );
};
