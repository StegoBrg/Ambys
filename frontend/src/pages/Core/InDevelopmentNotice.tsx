import { Center, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';

function InDevelopmentNotice() {
  const { t } = useTranslation();

  return (
    <Center>
      <Text size='xl' c='tomato'>
        {t('general.inDevelopmentNotice')}
      </Text>
    </Center>
  );
}

export default InDevelopmentNotice;
