import React from 'react';
import { useTranslation } from 'react-i18next';
import { Popover, IconButton, Flex} from '@radix-ui/themes';
import { FiFilter } from 'react-icons/fi';
import { FaSortNumericDownAlt } from "react-icons/fa";


export type OrdersTableFilterSortProps = {
  filterSymbol: string;
  setFilterSymbol: (v: string) => void;
  filterSide: string;
  setFilterSide: (v: string) => void;
  sortKey: 'id' | 'symbol' | 'quantity' | 'price' | 'side';
  setSortKey: (v: 'id' | 'symbol' | 'quantity' | 'price' | 'side') => void;
  sortDir: 'asc' | 'desc';
  setSortDir: (v: 'asc' | 'desc') => void;
};

export const OrdersTableFilterSort: React.FC<OrdersTableFilterSortProps> = ({
  filterSymbol,
  setFilterSymbol,
  filterSide,
  setFilterSide,
  sortKey,
  setSortKey,
  sortDir,
  setSortDir
}) => {
  const { t } = useTranslation();
  return (
    <Flex gap="3">
      <Popover.Root>
        <Popover.Trigger>
          <IconButton variant='ghost' color="gray">
            <FiFilter size={20} aria-label={t('Filter')}  />
          </IconButton>
        </Popover.Trigger>
        <Popover.Content> 
          <label style={{ marginRight: 8 }}>{t('Symbol')}:
            <input
              type="text"
              value={filterSymbol}
              onChange={e => setFilterSymbol(e.target.value)}
              style={{ marginLeft: 4, marginRight: 16 }}
              placeholder={t('Symbol')}
            />
          </label>
          <label style={{ marginRight: 8 }}>{t('Side')}:
            <select
              value={filterSide}
              onChange={e => setFilterSide(e.target.value)}
              style={{ marginLeft: 4, marginRight: 16 }}
            >
              <option value="">{t('All')}</option>
              <option value="buy">{t('Buy')}</option>
              <option value="sell">{t('Sell')}</option>
            </select>
          </label>
        </Popover.Content>
      </Popover.Root>
      <Popover.Root>
        <Popover.Trigger>
          <IconButton variant='ghost' color='gray'>
            <FaSortNumericDownAlt size={20} aria-label={t('Filter')} />
          </IconButton>
        </Popover.Trigger>
        <Popover.Content>
          <label style={{ marginRight: 8 }}>{t('Sort by')}:
            <select
              value={sortKey}
              onChange={e => setSortKey(e.target.value as 'id' | 'symbol' | 'quantity' | 'price' | 'side')}
              style={{ marginLeft: 4, marginRight: 16 }}
            >
              <option value="id">{t('ID')}</option>
              <option value="symbol">{t('Symbol')}</option>
              <option value="quantity">{t('Quantity')}</option>
              <option value="price">{t('Price')}</option>
              <option value="side">{t('Side')}</option>
            </select>
          </label>
          <label>
            <select
              value={sortDir}
              onChange={e => setSortDir(e.target.value as 'asc' | 'desc')}
              style={{ marginLeft: 4 }}
            >
              <option value="asc">{t('Ascending')}</option>
              <option value="desc">{t('Descending')}</option>
            </select>
          </label>
        </Popover.Content>
      </Popover.Root>

    </Flex>
  );
};
