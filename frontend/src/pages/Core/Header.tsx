import {
  ActionIcon,
  Button,
  Center,
  Drawer,
  Flex,
  Paper,
  Stack,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { useState } from 'react';
import { RxDoubleArrowRight } from 'react-icons/rx';
import { LuSunMedium } from 'react-icons/lu';
import { FiMoon } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { UserButton } from './UserButton';

function Header() {
  const [showSidebar, setShowSidebar] = useState(false);

  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { toggleColorScheme } = useMantineColorScheme();

  const { t } = useTranslation();
  const navigate = useNavigate();
  const currPath = window.location.pathname;

  function handleSidebarNavigate(path: string) {
    setShowSidebar(false);
    navigate(path);
  }

  return (
    <>
      <Flex
        p={2}
        bg={
          colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[4]
        }
        top={0}
        align='center'
      >
        <ActionIcon
          variant='subtle'
          size='xl'
          onClick={() => setShowSidebar(true)}
        >
          <RxDoubleArrowRight size='2em' />
        </ActionIcon>

        <Center flex='1'>
          <Title order={2}>Ambys</Title>
        </Center>

        <ActionIcon
          onClick={() => toggleColorScheme()}
          variant='subtle'
          size='xl'
          aria-label='Toggle color scheme'
        >
          {colorScheme === 'light' ? (
            <FiMoon size='1.5em' />
          ) : (
            <LuSunMedium size='1.5em' />
          )}
        </ActionIcon>
      </Flex>

      <Drawer
        opened={showSidebar}
        onClose={() => setShowSidebar(false)}
        title='Navigation'
        size='20em'
      >
        <Stack>
          <Paper>
            <UserButton onNavigate={() => setShowSidebar(false)} />
          </Paper>

          <Button
            size='md'
            color={currPath === '/' ? 'blue' : 'gray'}
            onClick={() => handleSidebarNavigate('/')}
          >
            {t('sidebar.home')}
          </Button>
          <Button
            size='md'
            color={currPath === '/diary' ? 'blue' : 'gray'}
            onClick={() => handleSidebarNavigate('/diary')}
          >
            {t('sidebar.diary')}
          </Button>
          <Button
            size='md'
            color={currPath === '/calendar' ? 'blue' : 'gray'}
            onClick={() => handleSidebarNavigate('/calendar')}
          >
            {t('sidebar.calendar')}
          </Button>
          <Button
            size='md'
            color={currPath === '/notebooks' ? 'blue' : 'gray'}
            onClick={() => handleSidebarNavigate('/notebooks')}
          >
            {t('sidebar.notebooks')}
          </Button>
          <Button
            size='md'
            color={currPath === '/medications' ? 'blue' : 'gray'}
            onClick={() => handleSidebarNavigate('/medications')}
          >
            {t('sidebar.medications')}
          </Button>
          <Button
            size='md'
            color={currPath === '/reports' ? 'blue' : 'gray'}
            onClick={() => handleSidebarNavigate('/reports')}
          >
            {t('sidebar.reports')}
          </Button>
          <Button
            size='md'
            color={currPath === '/settings' ? 'blue' : 'gray'}
            onClick={() => handleSidebarNavigate('/settings')}
          >
            {t('sidebar.settings')}
          </Button>
        </Stack>
      </Drawer>
    </>
  );
}

export default Header;
