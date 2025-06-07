import { useTranslation } from 'react-i18next';
import { Link } from '@/components/link'
import { FiList, FiGrid } from 'react-icons/fi';
import { Flex, Text } from '@radix-ui/themes';

export function Nav(){
  const { t } = useTranslation() 
  return (
    <ul style={{ listStyleType: 'none', padding: 0 }}>
      <li>                
        <Link to="/">
          <Flex align="center" gap="2">
            <FiGrid />
            <Text>{t("Home")}</Text>
          </Flex>
        </Link>
      </li>
      <li>
        <Link to="/orders">
          <Flex align="center" gap="2">
            <FiList />
            <Text>{t("Orders")}</Text> 
          </Flex>
        </Link>
      </li>
    </ul>
  )
} 