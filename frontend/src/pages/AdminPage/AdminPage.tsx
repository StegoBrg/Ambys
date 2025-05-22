import {
  ActionIcon,
  Box,
  Center,
  em,
  NavLink,
  Popover,
  Select,
  Stack,
  Table,
} from '@mantine/core';
import { UserData } from '../../Types';
import { useEffect, useState } from 'react';
import axiosInstance from '../../lib/axiosInstance';
import { useMediaQuery } from '@mantine/hooks';
import { TbDotsVertical, TbPasswordUser, TbTrash } from 'react-icons/tb';
import ResetPassword from './ResetPassword';
import { useTranslation } from 'react-i18next';
import DeleteUserConfirm from './DeleteUserConfirm';

function AdminPage() {
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
  const { t } = useTranslation();

  const [popoverOpened, setPopoverOpened] = useState<boolean[]>([false]);

  const [allUsers, setAllUsers] = useState<UserData[]>([]);

  const [resetPwUser, setResetPwUser] = useState<UserData | undefined>(
    undefined
  );
  const [deleteUser, setDeleteUser] = useState<UserData | undefined>(undefined);

  function getAllUsers() {
    axiosInstance.get('Users/all').then((response) => {
      setAllUsers(response.data);

      setPopoverOpened(new Array(response.data.length).fill(false));
    });
  }

  useEffect(() => {
    getAllUsers();
  }, []);

  function changeUserRole(userId: string, newRole: string) {
    axiosInstance
      .put(`Users/${userId}/change-roles`, { roles: [newRole] })
      .then(() => {

        // Reload data.
        getAllUsers();
      });
  }

  return (
    <>
      <Center>
        <Box w={!isMobile ? '80%' : '90%'} mt={20}>
          <Table.ScrollContainer minWidth={700}>
            <Table withColumnBorders variant='vertical'>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>{t('adminPage.table.userID')}</Table.Th>
                  <Table.Th>{t('adminPage.table.username')}</Table.Th>
                  <Table.Th>{t('adminPage.table.fullName')}</Table.Th>
                  <Table.Th>{t('adminPage.table.role')}</Table.Th>
                  <Table.Th>{t('adminPage.table.moreActions')}</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {allUsers.map((user, key) => (
                  <Table.Tr key={user.id}>
                    <Table.Td>{user.id}</Table.Td>
                    <Table.Td>{user.username}</Table.Td>
                    <Table.Td>{user.fullName}</Table.Td>
                    <Table.Td>
                      {
                        <Select
                          value={user.roles[0]}
                          data={['Admin', 'User']}
                          onChange={(e) => {
                            changeUserRole(user.id, e ? e : user.roles[0]);
                          }}
                        />
                      }
                    </Table.Td>
                    <Table.Td>
                      <Popover
                        opened={popoverOpened[key]}
                        onChange={() => {
                          setPopoverOpened((o) => {
                            const newOpened = [...o];
                            newOpened[key] = !newOpened[key];
                            return newOpened;
                          });
                        }}
                        withArrow
                      >
                        <Popover.Target>
                          <Center>
                            <ActionIcon
                              size='lg'
                              onClick={() => {
                                setPopoverOpened((o) => {
                                  const newOpened = [...o];
                                  newOpened[key] = !newOpened[key];
                                  return newOpened;
                                });
                              }}
                            >
                              <TbDotsVertical size={20} />
                            </ActionIcon>
                          </Center>
                        </Popover.Target>

                        <Popover.Dropdown>
                          <Stack>
                            <NavLink
                              label={t('adminPage.resetPw.title')}
                              onClick={() => {
                                setResetPwUser(user);

                                setPopoverOpened((o) => {
                                  const newOpened = [...o];
                                  newOpened[key] = false;
                                  return newOpened;
                                });
                              }}
                              leftSection={<TbPasswordUser />}
                            />

                            <NavLink
                              label={t('adminPage.table.deleteAction')}
                              c='red'
                              onClick={() => {
                                setDeleteUser(user);

                                setPopoverOpened((o) => {
                                  const newOpened = [...o];
                                  newOpened[key] = false;
                                  return newOpened;
                                });
                              }}
                              leftSection={<TbTrash />}
                            />
                          </Stack>
                        </Popover.Dropdown>
                      </Popover>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Box>
      </Center>

      {resetPwUser !== undefined && (
        <ResetPassword
          opened={resetPwUser !== undefined}
          onClose={() => setResetPwUser(undefined)}
          user={resetPwUser}
        />
      )}

      {deleteUser !== undefined && (
        <DeleteUserConfirm
          opened={deleteUser !== undefined}
          onClose={() => {
            setDeleteUser(undefined);
            getAllUsers();
          }}
          user={deleteUser}
        />
      )}
    </>
  );
}

export default AdminPage;
