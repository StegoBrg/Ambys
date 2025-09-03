import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  em,
  Paper,
  Space,
  Stack,
  TextInput,
  Title,
  Text,
  Group,
  FileButton,
} from '@mantine/core';
import { useState, useEffect } from 'react';
import axiosInstance from '../../lib/axiosInstance';
import { AccessToken, UserData } from '../../Types';
import { apiUrlBase, isErrorResponse } from '../../lib/globalUtils';
import { TbCloudUpload, TbLockPassword } from 'react-icons/tb';
import { useMediaQuery } from '@mantine/hooks';
import { TbEdit } from 'react-icons/tb';
import { TbTrash } from 'react-icons/tb';
import { TbPlus } from 'react-icons/tb';
import { notifications } from '@mantine/notifications';
import ChangePasswordModal from './ChangePasswordModal';
import AddAccessToken from './AddAccessToken';
import { useTranslation } from 'react-i18next';
import { useUserSettings } from '../../stores/useUserSettingsStore';
import dayjs from 'dayjs';

function UserPage() {
  const { t } = useTranslation();
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
  const dateFormat = useUserSettings((state) => state.dateFormat);

  const [userData, setUserData] = useState<UserData>({
    id: '',
    username: '',
    fullName: '',
    profilePicture: '',
    roles: ['user'],
  });

  const [accessTokens, setAccessTokens] = useState<AccessToken[]>([]);

  const [username, setUsername] = useState(userData.username);
  const [fullName, setFullName] = useState(userData.fullName);

  const [pwChangeModalOpened, setPwChangeModalOpened] = useState(false);
  const [accessTokenModalOpened, setAccessTokenModalOpened] = useState(false);

  useEffect(() => {
    axiosInstance.get('Users/self').then((response) => {
      setUserData(response.data);
    });

    axiosInstance.get('PersonalAccessTokens').then((response) => {
      setAccessTokens(response.data);
    });
  }, []);

  useEffect(() => {
    setUsername(userData.username);
    setFullName(userData.fullName);
  }, [userData.fullName, userData.username]);

  function uploadProfilePicture(picture: File) {
    const form = new FormData();
    form.append('file', picture);

    axiosInstance
      .post('Users/self/upload-profilepicture', form)
      .then(() => {
        axiosInstance.get('Users/self').then((response) => {
          setUserData(response.data);
        });
      })
      .catch((error) => {
        const errorData = error.response?.data;
        if (isErrorResponse(errorData)) {
          notifications.show({
            title: errorData.code,
            message: errorData.description,
            color: 'red',
            position: 'bottom-center',
          });
        }
      });
  }

  function updateUserData() {
    axiosInstance.put('Users/self', {
      userName: username,
      fullName: fullName,
    });
  }

  function deleteAccessToken(tokenId: number) {
    axiosInstance
      .delete('PersonalAccessTokens/' + tokenId)
      .then(() => {
        setAccessTokens((prevTokens) =>
          prevTokens.filter((token) => token.id !== tokenId)
        );
      })
      .catch((error) => {
        const errorData = error.response?.data;
        if (isErrorResponse(errorData)) {
          notifications.show({
            title: errorData.code,
            message: errorData.description,
            color: 'red',
            position: 'bottom-center',
          });
        }
      });
  }

  return (
    <>
      <Space h='md' />
      <Center>
        <Stack>
          <Center>
            <Avatar
              src={
                userData.profilePicture
                  ? apiUrlBase + userData.profilePicture
                  : null
              }
              size='xl'
            />
          </Center>
          <FileButton
            onChange={(e) => {
              if (e !== null) {
                uploadProfilePicture(e);
              }
            }}
            accept='image/png,image/jpeg'
          >
            {(props) => (
              <Button
                {...props}
                variant='subtle'
                leftSection={<TbCloudUpload size={20} />}
              >
                {t('userPage.profilePictureUploadButton')}
              </Button>
            )}
          </FileButton>
        </Stack>
      </Center>

      <Center>
        <Title>{t('userPage.userSettings')}</Title>
      </Center>

      <Center>
        <Divider w={isMobile ? '90%' : '60%'} />
      </Center>

      <Box ml={isMobile ? '5%' : '20%'} mr={isMobile ? '5%' : '20%'} mt={20}>
        <Button
          onClick={() => setPwChangeModalOpened(true)}
          leftSection={<TbLockPassword size={20} />}
        >
          {t('userPage.changePassword')}
        </Button>

        <Title mt={20} order={2}>
          {t('userPage.personalData')}
        </Title>

        <Paper withBorder>
          <Stack m={10}>
            <TextInput
              label='Username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextInput
              label='Full Name'
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <TextInput label='Role' disabled value={userData.roles} />
            <Button
              onClick={() => updateUserData()}
              leftSection={<TbEdit size={20} />}
            >
              {t('userPage.updateUserData')}
            </Button>
          </Stack>
        </Paper>

        <Space h='xl' />

        <Title mt={20} order={2}>
          {t('userPage.personalAccessTokens')}
        </Title>

        <Divider mb={20} />

        <Button
          mb={10}
          onClick={() => setAccessTokenModalOpened(true)}
          leftSection={<TbPlus size={20} />}
        >
          {t('userPage.addNewToken')}
        </Button>

        <Stack>
          {accessTokens.map((token) => (
            <Paper withBorder key={token.id}>
              <Group justify='space-between' m={10}>
                <Stack gap={0}>
                  <Text size='lg'>{token.name}</Text>
                  <Text c='dimmed'>
                    {t('userPage.tokenCreatedAt')}{' '}
                    {dayjs(token.createdAt).format(dateFormat)}
                  </Text>
                </Stack>

                <Button
                  bg='red'
                  leftSection={<TbTrash size={20} />}
                  style={{ float: 'right' }}
                  onClick={() => deleteAccessToken(token.id)}
                >
                  {t('userPage.deleteToken')}
                </Button>
              </Group>
            </Paper>
          ))}
        </Stack>
      </Box>

      <ChangePasswordModal
        opened={pwChangeModalOpened}
        onClose={() => setPwChangeModalOpened(false)}
      />

      <AddAccessToken
        opened={accessTokenModalOpened}
        onClose={() => setAccessTokenModalOpened(false)}
      />
    </>
  );
}

export default UserPage;
