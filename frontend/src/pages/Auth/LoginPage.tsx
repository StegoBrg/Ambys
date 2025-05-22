import {
  Container,
  Title,
  Anchor,
  Paper,
  TextInput,
  PasswordInput,
  Group,
  Button,
  Text,
} from '@mantine/core';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { apiUrlBase, createNoteConfigIfNeeded } from '../../lib/globalUtils';
import { useState } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { saveRefreshToken } from '../../lib/authStorage';

function LoginPage() {
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function handleLogin() {
    axios
      .post<{ accessToken: string; refreshToken: string }>(
        apiUrlBase + 'auth/login',
        {
          username: username,
          password: password,
        }
      )
      .then((response) => {
        if (response.status === 200) {
          // Store the accessToken in zustand store.
          setAccessToken(response.data.accessToken);

          // Store the refreshToken in local storage.
          saveRefreshToken(response.data.refreshToken);

          // Create default note config if needed.
          createNoteConfigIfNeeded();

          navigate('/');
        }
      });
  }

  return (
    <Container size={420} my={40}>
      <Title ta='center'>Welcome back!</Title>
      <Text c='dimmed' size='sm' ta='center' mt={5}>
        Do not have an account yet?{' '}
        <Anchor
          size='sm'
          component='button'
          onClick={() => navigate('/register')}
        >
          Create account
        </Anchor>
      </Text>

      <Paper withBorder shadow='md' p={30} mt={30} radius='md'>
        <TextInput
          label='Username'
          placeholder='Your username'
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <PasswordInput
          label='Password'
          placeholder='Your password'
          required
          mt='md'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Group justify='space-between' mt='lg'>
          <Anchor component='button' size='sm'>
            Forgot password?
          </Anchor>
        </Group>
        <Button fullWidth mt='xl' onClick={handleLogin}>
          Sign in
        </Button>
      </Paper>
    </Container>
  );
}

export default LoginPage;
