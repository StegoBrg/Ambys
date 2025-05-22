import {
  Button,
  CopyButton,
  Modal,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { useState } from 'react';
import axiosInstance from '../../lib/axiosInstance';
import { isErrorResponse } from '../../lib/globalUtils';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';

interface Props {
  opened: boolean;
  onClose: () => void;
}

function AddAccessToken(props: Props) {
  const { t } = useTranslation();

  const [tokenName, setTokenName] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenGenerated, setTokenGenerated] = useState(false);

  function generateToken() {
    setLoading(true);

    axiosInstance
      .post<{ token: string }>('PersonalAccessTokens', {
        name: tokenName,
      })
      .then((response) => {
        setLoading(false);
        setTokenGenerated(true);
        setToken(response.data.token);
      })
      .catch((error) => {
        setLoading(false);

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
    <Modal
      opened={props.opened}
      onClose={() => props.onClose()}
      title={t('auth.addAccessToken.title')}
    >
      <TextInput
        label={t('auth.addAccessToken.tokenName')}
        placeholder={t('auth.addAccessToken.tokenNamePlaceholder')}
        required
        value={tokenName}
        onChange={(e) => setTokenName(e.target.value)}
      />

      {!tokenGenerated && (
        <Button
          fullWidth
          mt={10}
          onClick={() => generateToken()}
          disabled={!tokenName}
          loading={loading}
        >
          {t('auth.addAccessToken.generateButton')}
        </Button>
      )}

      {tokenGenerated && (
        <>
          <Title order={5} mt={20}>
            {t('auth.addAccessToken.tokenDescription')}
          </Title>
          <Textarea mt={10} readOnly autosize value={token} />

          <CopyButton value={token}>
            {({ copied, copy }) => (
              <Button
                mt={10}
                fullWidth
                color={copied ? 'teal' : 'blue'}
                onClick={copy}
              >
                {copied
                  ? t('auth.addAccessToken.copiedTokenButton')
                  : t('auth.addAccessToken.copyTokenButton')}
              </Button>
            )}
          </CopyButton>
        </>
      )}
    </Modal>
  );
}

export default AddAccessToken;
