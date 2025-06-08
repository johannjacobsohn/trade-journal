import React, { useState } from 'react';
import i18n from '@/i18n';

import { FiGlobe, FiSun, FiMoon, FiMonitor, FiSettings } from 'react-icons/fi';
import {
  DropdownMenu, 
  Box, 
  Text, 
  Flex,
  Link
} from '@radix-ui/themes'
import { useTheme } from 'next-themes';

type Language = 'en' | 'de' | 'fr' | 'es';

interface UserSettingsProps {
  userName: string;
  userImage?: string;
}

export const UserSettings: React.FC<UserSettingsProps> = ({
  userName,
}) => {

  const [language, setLanguage] = useState<Language>("en");
  const {theme, setTheme} = useTheme()

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage as Language);

  };

  return (
    <Box>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Link asChild style={{ cursor: 'pointer' }}>
            <Flex gap="2" align="center" >
              <FiSettings />
              <Text className='nav-label'>Settings</Text>
            </Flex>
          </Link>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Label>
            <Text size="2">Signed in as {userName}</Text>
          </DropdownMenu.Label>
                
          <DropdownMenu.Separator />
                
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>
              <Flex gap="2" align="center">
                <FiGlobe />
                <Text>Language: {language.toUpperCase()}</Text>
              </Flex>
            </DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.Item onClick={() => handleLanguageChange('en')}>
                English
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => handleLanguageChange('de')}>
                Deutsch
              </DropdownMenu.Item>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
                
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>
              <Flex gap="2" align="center">
                {theme === 'light' ? <FiSun /> : <FiMoon />}
                <Text>Theme: {theme === 'light' ? 'Light' : 'Dark'}</Text>
              </Flex>
            </DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.Item onClick={() => setTheme('light')}>
                <Flex gap="2" align="center">
                  <FiSun />
                  <Text>Light</Text>
                </Flex>
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => setTheme('dark')}>
                <Flex gap="2" align="center">
                  <FiMoon />
                  <Text>Dark</Text>
                </Flex>
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => setTheme('system')}>
                <Flex gap="2" align="center">
                  <FiMonitor />
                  <Text>System</Text>
                </Flex>
              </DropdownMenu.Item>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Box>
  )
}