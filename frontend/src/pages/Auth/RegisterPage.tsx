import {
  Container,
  Title,
  Anchor,
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Text,
  Group,
  Stack,
} from '@mantine/core';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { TbX } from 'react-icons/tb';
import { TbCheck } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import {
  apiUrlBase,
  isErrorResponse,
  isIdentityError,
} from '../../lib/globalUtils';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';

function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  function handleRegister() {
    // Handle registration logic here
    axios
      .post(apiUrlBase + 'auth/register', {
        username: username,
        password: password,
      })
      .then(() => {
        navigate('/login');
      })
      .catch((error: AxiosError) => {
        console.error(error);
        const errorData = error.response?.data;

        if (isIdentityError(errorData)) {
          errorData.forEach((err) => {
            notifications.show({
              title: err.code,
              message: err.description,
              color: 'red',
              position: 'bottom-center',
            });
          });
        } else if (isErrorResponse(errorData)) {
          notifications.show({
            title: errorData.code,
            message: errorData.description,
            color: 'red',
            position: 'bottom-center',
          });
        } else {
          // Fallback for unknown error format
          notifications.show({
            title: 'Unknown error',
            message: 'An unknown error occurred.',
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
    return password.length >= 8;
  }

  function checkPWUpperCase() {
    return /[A-Z]/.test(password);
  }

  function checkPWLowerCase() {
    return /[a-z]/.test(password);
  }

  function checkPWNumber() {
    return /\d/.test(password);
  }

  function checkPWMatch() {
    return password === confirmPassword;
  }

  return (
    <Container size={420} my={40}>
      <Title ta='center'>{t('auth.register.title')}</Title>
      <Text c='dimmed' size='sm' ta='center' mt={5}>
        {t('auth.register.alreadyHaveAccount')}{' '}
        <Anchor size='sm' component='button' onClick={() => navigate('/login')}>
          {t('auth.register.loginRedirect')}
        </Anchor>
      </Text>

      <Paper withBorder shadow='md' p={30} mt={30} radius='md'>
        <TextInput
          label={t('auth.register.username')}
          placeholder={t('auth.register.usernamePlaceholder')}
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <PasswordInput
          label={t('auth.register.password')}
          placeholder={t('auth.register.passwordPlaceholder')}
          required
          mt='md'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <PasswordInput
          label={t('auth.register.confirmPassword')}
          placeholder={t('auth.register.confirmPasswordPlaceholder')}
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
          disabled={!checkPWRequirements() || !username}
          onClick={() => handleRegister()}
        >
          {t('auth.register.registerButton')}
        </Button>
      </Paper>
    </Container>
  );
}

export default RegisterPage;
