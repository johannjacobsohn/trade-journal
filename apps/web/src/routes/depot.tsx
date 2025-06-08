import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Button, Flex, Heading, TextField, Card } from '@radix-ui/themes';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/depot')({
  component: DepotPage,
})


function DepotPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ['depot'],
    queryFn: async () => {
      const res = await fetch('/api/depot');
      if (!res.ok) throw new Error('Fehler beim Laden des Depotwerts');
      return res.json();
    }
  });
  const [value, setValue] = useState('');
  const mutation = useMutation({
    mutationFn: async (val: number) => {
      const res = await fetch('/api/depot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: val })
      });
      if (!res.ok) throw new Error('Fehler beim Setzen des Depotwerts');
      return res.json();
    },
    onSuccess: () => {
      setValue('');
      queryClient.invalidateQueries({ queryKey: ['depot'] });
    }
  });

  return (
    <Flex direction="column" gap="5" style={{ maxWidth: 400 }}>
      <Heading as="h1" size="8">{t('Depot')}</Heading>
      <Card size="4" mt="6">
        <Flex direction="column" gap="4">
          {isLoading ? (
            <div>{t('Loading Depot...')}</div>
          ) : error ? (
            <div style={{ color: 'red' }}>{t('Error loading depot')}</div>
          ) : (
            <div>{t('Depot Value')}: <b>{data.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</b></div>
          )}
          <form onSubmit={e => { e.preventDefault(); mutation.mutate(Number(value)); }}>
            <TextField.Root
              placeholder={t('Set Depot Value')}
              type="number"
              value={value}
              onChange={e => setValue(e.target.value)}
              min={0}
              step={0.01}
            />
            <Button type="submit" mt="3" disabled={mutation.isPending || !value}>{t('Set')}</Button>
          </form>
        </Flex>
      </Card>
    </Flex>
  );
}
