import {
  Alert,
  Button,
  Group,
  Modal,
  Paper,
  PasswordInput,
  Stack,
  Text,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TbCheck, TbX } from 'react-icons/tb';
import axiosInstance from '../../lib/axiosInstance';
import { isErrorResponse } from '../../lib/globalUtils';
import { UserData } from '../../Types';

interface Props {
  user: UserData;
  opened: boolean;
  onClose: () => void;
}

function ResetPassword(props: Props) {
  const { t } = useTranslation();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  function handlePwChange() {
    axiosInstance
      .post(`Users/${props.user.id}/reset-password`, {
        newPassword: newPassword,
      })
      .then(() => {
        notifications.show({
          title: 'Success',
          message: 'Password changed successfully',
          color: 'green',
          position: 'bottom-center',
        });

        props.onClose();
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
      title={t('adminPage.resetPw.title')}
    >
      <Alert>
        {t('adminPage.resetPw.userAlert')} "{props.user.username}".
      </Alert>

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
        disabled={!checkPWRequirements()}
        onClick={() => handlePwChange()}
      >
        {t('auth.changePw.changeButton')}
      </Button>
    </Modal>
  );
}

export default ResetPassword;
