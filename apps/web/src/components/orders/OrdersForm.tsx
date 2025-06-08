import React from 'react';
import { Flex, Box, Button, TextField } from '@radix-ui/themes';

export type OrdersFormValues = {
  symbol: string;
  quantity: string | number;
  price: string | number;
  side: 'buy' | 'sell';
};

interface OrdersFormProps {
  values: OrdersFormValues;
  onChange: (values: OrdersFormValues) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel: string;
  loading?: boolean;
  error?: string | null;
  disabled?: boolean;
}

export const OrdersForm: React.FC<OrdersFormProps> = ({
  values,
  onChange,
  onSubmit,
  submitLabel,
  loading,
  error,
  disabled
}) => {
  function handleInput(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    onChange({ ...values, [e.target.name]: e.target.value });
  }

  return (
    <form onSubmit={onSubmit}>
      <Flex direction="column" gap="3">
        <TextField.Root
          placeholder="Symbol"
          name="symbol"
          value={values.symbol}
          onChange={handleInput}
          disabled={disabled}
        />
        <TextField.Root
          placeholder="Menge"
          name="quantity"
          type="number"
          value={values.quantity}
          onChange={handleInput}
          disabled={disabled}
        />
        <TextField.Root
          placeholder="Preis"
          name="price"
          type="number"
          value={values.price}
          onChange={handleInput}
          disabled={disabled}
        />
        <Box>
          <select name="side" value={values.side} onChange={handleInput} style={{ width: '100%', padding: 8 }} disabled={disabled}>
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </Box>
        {error && <Box style={{ color: 'red' }}>{error}</Box>}
        <Button type="submit" loading={loading} disabled={loading || disabled}>
          {submitLabel}
        </Button>
      </Flex>
    </form>
  );
};
