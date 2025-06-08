import { useTranslation } from 'react-i18next';
import { Link } from '@/components/link'
import { FiList, FiGrid, FiTrendingUp, FiRepeat } from 'react-icons/fi';

import { TbPigMoney } from 'react-icons/tb';
import { Flex, Text } from '@radix-ui/themes';

export function Nav(){
  const { t } = useTranslation() 
  return (
    <ul className="navigation-list" style={{ listStyleType: 'none', padding: 0 }}>
      <li style={{ marginBottom: '8px' }}>                
        <Link to="/">
          <Flex align="center" gap="2" className="nav-item">
            <FiGrid size="20" />
            <Text size="3" className='nav-label'>{t("Home")}</Text>
          </Flex>
        </Link>
      </li>
      <li style={{ marginBottom: '8px' }}>
        <Link to="/orders">
          <Flex align="center" gap="2" className="nav-item">
            <FiList size="20" />
            <Text size="3" className='nav-label'>{t("Orders")}</Text> 
          </Flex>
        </Link>
      </li>
      <li style={{ marginBottom: '8px' }}>
        <Link to="/trades">
          <Flex align="center" gap="2" className="nav-item">
            <FiRepeat size="20" />
            <Text size="3" className='nav-label'>{t("Trades")}</Text>
          </Flex>
        </Link>
      </li>
      <li style={{ marginBottom: '8px' }}>
        <Link to="/openstock">
          <Flex align="center" gap="2" className="nav-item">
            <FiTrendingUp size="20" />
            <Text size="3" className='nav-label'>{t("Open Positions")}</Text>
          </Flex>
        </Link>
      </li>
      <li style={{ marginBottom: '8px' }}>
        <Link to="/depot">
          <Flex align="center" gap="2" className="nav-item">
            <TbPigMoney />
            <Text size="3" className='nav-label'>{t("Depot")}</Text>
          </Flex>
        </Link>
      </li>
      <li style={{ marginBottom: '8px' }}>
        <Link to="/analytics">
          <Flex align="center" gap="2" className="nav-item">
            <FiGrid size="20" />
            <Text size="3" className='nav-label'>{t("Analytics")}</Text>
          </Flex>
        </Link>
      </li>
    </ul>
  )
}