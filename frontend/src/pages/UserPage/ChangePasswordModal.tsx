import {
  Button,
  Group,
  Modal,
  Paper,
  PasswordInput,
  Stack,
  Text,
} from '@mantine/core';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TbCheck, TbX } from 'react-icons/tb';
import axiosInstance from '../../lib/axiosInstance';
import { isErrorResponse } from '../../lib/globalUtils';
import { notifications } from '@mantine/notifications';

interface Props {
  opened: boolean;
  onClose: () => void;
}

function ChangePasswordModal(props: Props) {
  const { t } = useTranslation();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  function handlePwChange() {
    axiosInstance
      .post('auth/change-password', {
        oldPassword: oldPassword,
        newPassword: newPassword,
      })
      .then(() => {
        location.reload();
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

  function checkPWRequirements() {
    return (
      checkPWLength() &&
      checkPWUpperCase() &&
      checkPWLowerCase() &&
      checkPWNumber() &&
      checkPWMatch()
    );
  }

  function checkPWLength() {
    return newPassword.length >= 8;
  }

  function checkPWUpperCase() {
    return /[A-Z]/.test(newPassword);
  }

  function checkPWLowerCase() {
    return /[a-z]/.test(newPassword);
  }

  function checkPWNumber() {
    return /\d/.test(newPassword);
  }

  function checkPWMatch() {
    return newPassword === confirmPassword;
  }

  return (
    <Modal
      opened={props.opened}
      onClose={() => {
        props.onClose();
      }}
      title={t('auth.changePw.title')}
    >
      <PasswordInput
        label={t('auth.changePw.oldPassword')}
        placeholder={t('auth.changePw.oldPasswordPlaceholder')}
        required
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />

      <PasswordInput
        label={t('auth.changePw.newPassword')}
        placeholder={t('auth.changePw.newPasswordPlaceholder')}
        required
        mt='md'
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <PasswordInput
        label={t('auth.changePw.confirmNewPassword')}
        placeholder={t('auth.changePw.confirmNewPasswordPlaceholder')}
        required
        mt='md'
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <Paper withBorder shadow='md' p={20} mt={30} radius='md'>
        <Stack gap='sm'>
          <Group align='center' wrap='nowrap'>
            {checkPWLength() ? (
              <TbCheck size={20} color='green' />
            ) : (
              <TbX size={20} color='red' />
            )}

            <Text>{t('auth.register.passwordRequirements.minLength')}</Text>
          </Group>

          <Group align='center' wrap='nowrap'>
            {checkPWNumber() ? (
              <TbCheck size={20} color='green' />
            ) : (
              <TbX size={20} color='red' />
            )}

            <Text>{t('auth.register.passwordRequirements.number')}</Text>
          </Group>

          <Group align='center' wrap='nowrap'>
            {checkPWLowerCase() ? (
              <TbCheck size={20} color='green' />
            ) : (
              <TbX size={20} color='red' />
            )}

            <Text>{t('auth.register.passwordRequirements.lowercase')}</Text>
          </Group>

          <Group align='center' wrap='nowrap'>
            {checkPWUpperCase() ? (
              <TbCheck size={20} color='green' />
            ) : (
              <TbX size={20} color='red' />
            )}

            <Text>{t('auth.register.passwordRequirements.uppercase')}</Text>
          </Group>

          <Group align='center' wrap='nowrap'>
            {checkPWMatch() ? (
              <TbCheck size={20} color='green' />
            ) : (
              <TbX size={20} color='red' />
            )}

            <Text>{t('auth.register.passwordRequirements.match')}</Text>
          </Group>
        </Stack>
      </Paper>

      <Button
        fullWidth
        mt='xl'
        disabled={!checkPWRequirements() || !oldPassword}
        onClick={() => handlePwChange()}
      >
        {t('auth.changePw.changeButton')}
      </Button>
    </Modal>
  );
}

export default ChangePasswordModal;
