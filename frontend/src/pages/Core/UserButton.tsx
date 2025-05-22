import { TbChevronRight } from 'react-icons/tb';
import {
  Avatar,
  Group,
  Popover,
  Stack,
  Text,
  UnstyledButton,
  NavLink,
  em,
} from '@mantine/core';
import classes from './UserButton.module.css';
import axiosInstance from '../../lib/axiosInstance';
import { useEffect, useState } from 'react';
import { UserData } from '../../Types';
import { apiUrlBase } from '../../lib/globalUtils';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mantine/hooks';
import { TbUser } from 'react-icons/tb';
import { TbUserCog } from 'react-icons/tb';
import { TbLogout } from 'react-icons/tb';
import { useTranslation } from 'react-i18next';

interface Props {
  onNavigate: () => void;
}

export function UserButton(props: Props) {
  const { t } = useTranslation();
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
  const navigate = useNavigate();

  const [popOverOpened, setPopOverOpened] = useState(false);

  const [userData, setUserData] = useState<UserData>({
    id: '',
    username: '',
    fullName: '',
    profilePicture: '',
    roles: ['user'],
  });

  useEffect(() => {
    axiosInstance.get('Users/self').then((response) => {
      setUserData(response.data);
    });
  }, []);

  function handleNavigate(path: string) {
    navigate(path);
    setPopOverOpened(false);
    props.onNavigate();
  }

  function handleLogout() {
    axiosInstance.post('Auth/Logout').then(() => {
      handleNavigate('/login');
      // Force full refresh to clear access token from memory.
      window.location.reload();
    });
  }

  return (
    <Popover
      opened={popOverOpened}
      onChange={setPopOverOpened}
      position={isMobile ? 'bottom' : 'right-start'}
      withArrow
    >
      <Popover.Target>
        <UnstyledButton
          className={classes.user}
          onClick={() => setPopOverOpened((o) => !o)}
        >
          <Group>
            <Avatar
              src={
                userData.profilePicture
                  ? apiUrlBase + userData.profilePicture
                  : null
              }
              radius='xl'
            />

            <div style={{ flex: 1 }}>
              <Text size='sm' fw={500}>
                {userData.username}
              </Text>

              <Text c='dimmed' size='xs'>
                {userData.fullName}
              </Text>
            </div>

            <TbChevronRight size={14} />
          </Group>
        </UnstyledButton>
      </Popover.Target>

      <Popover.Dropdown>
        <Stack>
          <NavLink
            label={t('user.userProfileLink')}
            onClick={() => handleNavigate('/userprofile')}
            leftSection={<TbUser />}
          />
          {userData.roles.includes('Admin') && (
            <NavLink
              label={t('user.adminPageLink')}
              onClick={() => handleNavigate('/admin')}
              leftSection={<TbUserCog />}
            />
          )}

          <NavLink
            label={t('user.logoutLink')}
            onClick={() => handleLogout()}
            leftSection={<TbLogout />}
            c='red'
          />
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
