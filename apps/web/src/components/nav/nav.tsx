import { useTranslation } from 'react-i18next';
import { Link } from '@/components/link'
import { FiList, FiGrid, FiTrendingUp, FiRepeat } from 'react-icons/fi';
import { Flex, Text } from '@radix-ui/themes';

export function Nav(){
  const { t } = useTranslation() 
  return (
    <ul style={{ listStyleType: 'none', padding: 0 }}>
      <li style={{ marginBottom: '8px' }}>                
        <Link to="/">
          <Flex align="center" gap="2">
            <FiGrid size="20" />
            <Text size="3">{t("Home")}</Text>
          </Flex>
        </Link>
      </li>
      <li style={{ marginBottom: '8px' }}>
        <Link to="/orders">
          <Flex align="center" gap="2">
            <FiList size="20" />
            <Text size="3">{t("Orders")}</Text> 
          </Flex>
        </Link>
      </li>
      <li style={{ marginBottom: '8px' }}>
        <Link to="/trades">
          <Flex align="center" gap="2">
            <FiRepeat size="20" />
            <Text size="3">{t("Trades")}</Text>
          </Flex>
        </Link>
      </li>
      <li style={{ marginBottom: '8px' }}>
        <Link to="/openstock">
          <Flex align="center" gap="2">
            <FiTrendingUp size="20" />
            <Text size="3">{t("Open Stock Positions")}</Text>
          </Flex>
        </Link>
      </li>
    </ul>
  )
}