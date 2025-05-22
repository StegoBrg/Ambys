import { Alert, Button, Group, Modal, Text } from '@mantine/core';
import { UserData } from '../../Types';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TbExclamationCircle } from 'react-icons/tb';
import axiosInstance from '../../lib/axiosInstance';

interface Props {
  opened: boolean;
  onClose: () => void;
  user: UserData;
}

function DeleteUserConfirm(props: Props) {
  const { t } = useTranslation();

  const [counter, setCounter] = useState(20);
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    if (counter > 0) {
      const timer = setInterval(() => {
        setCounter((prev) => prev - 1);
      }, 1000);

      // Cleanup the interval on component unmount
      return () => clearInterval(timer);
    } else {
      // Enable the button when the countdown reaches 0
      setIsDisabled(false);
    }
  }, [counter]);

  // Reset the counter and disable the button every time the modal is opened.
  useEffect(() => {
    setCounter(20);
    setIsDisabled(true);
  }, [props.opened]);

  function deleteUser() {
    axiosInstance
      .delete('Users/' + props.user.id, {
        data: { confirmDeletion: true },
      })
      .then(() => {
        props.onClose();
      });
  }

  return (
    <Modal
      opened={props.opened}
      onClose={props.onClose}
      title={t('adminPage.deleteUser.title')}
      centered
    >
      <Alert
        color='red'
        variant='filled'
        title={t('adminPage.deleteUser.title')}
        icon={<TbExclamationCircle />}
      >
        <Text fw='bold'>
          {t('adminPage.deleteUser.modalText', {
            userName: props.user.username,
          })}
        </Text>
      </Alert>

      <Group justify='flex-end' mt='lg'>
        <Button
          mr='auto'
          color='red'
          disabled={isDisabled}
          onClick={() => {
            deleteUser();
            props.onClose();
          }}
        >
          {isDisabled
            ? t('adminPage.deleteUser.deletionButtonCounter') + counter
            : t('adminPage.deleteUser.deletionButtonFinal')}
        </Button>
        <Button onClick={() => props.onClose()}>
          {t('adminPage.deleteUser.cancelButton')}
        </Button>
      </Group>
    </Modal>
  );
}

export default DeleteUserConfirm;
