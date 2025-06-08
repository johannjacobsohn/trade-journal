import { useTranslation } from 'react-i18next';
import { Popover, IconButton, Flex } from '@radix-ui/themes';
import { FiFilter } from 'react-icons/fi';
import { FaSortNumericDownAlt } from 'react-icons/fa';

export type SortFilterProps<T extends string> = {
  filterValue: string;
  setFilterValue: (v: string) => void;
  filterLabel?: string;
  sortKey: T;
  setSortKey: (v: T) => void;
  sortDir: 'asc' | 'desc';
  setSortDir: (v: 'asc' | 'desc') => void;
  sortOptions: { value: T; label: string }[];
  sortLabel?: string;
};

export function SortFilter<T extends string>({
  filterValue,
  setFilterValue,
  filterLabel,
  sortKey,
  setSortKey,
  sortDir,
  setSortDir,
  sortOptions,
  sortLabel
}: SortFilterProps<T>) {
  const { t } = useTranslation();
  return (
    <Flex gap="3">
      <Popover.Root>
        <Popover.Trigger>
          <IconButton variant="ghost" color="gray">
            <FiFilter size={20} aria-label={t('Filter')} />
          </IconButton>
        </Popover.Trigger>
        <Popover.Content>
          <label>{filterLabel || t('Filter by symbol')}:
            <input
              type="text"
              value={filterValue}
              onChange={e => setFilterValue(e.target.value)}
              style={{ marginLeft: 4 }}
              placeholder={filterLabel || t('Symbol')}
            />
          </label>
        </Popover.Content>
      </Popover.Root>
      <Popover.Root>
        <Popover.Trigger>
          <IconButton variant="ghost" color="gray">
            <FaSortNumericDownAlt size={20} aria-label={t('Sort')} />
          </IconButton>
        </Popover.Trigger>
        <Popover.Content>
          <Flex gap="2" align="center">
            <label>{sortLabel || t('Sort by')}:
              <select
                value={sortKey}
                onChange={e => setSortKey(e.target.value as T)}
                style={{ marginLeft: 4, marginRight: 16 }}
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{t(opt.label)}</option>
                ))}
              </select>
            </label>
            <select
              value={sortDir}
              onChange={e => setSortDir(e.target.value as 'asc' | 'desc')}
              style={{ marginLeft: 4 }}
            >
              <option value="asc">{t('Ascending')}</option>
              <option value="desc">{t('Descending')}</option>
            </select>
          </Flex>
        </Popover.Content>
      </Popover.Root>
    </Flex>
  );
}
