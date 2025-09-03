import { Card, Group, Text, Title, Divider, Stack } from '@mantine/core';
import { useEffect, useState } from 'react';
import axiosInstance from '../../lib/axiosInstance';
import { UserData } from '../../Types';
import { useTranslation } from 'react-i18next';

interface Props {
  name: string;
  dailyNoteCount: number;
  startDate: string; // or Date
  endDate: string; // or Date
}

function ReportHeader(props: Props) {
  const { t } = useTranslation();

  const [fullName, setFullName] = useState('');

  useEffect(() => {
    axiosInstance.get<UserData>('Users/self').then((response) => {
      if (response.data.fullName) {
        setFullName(response.data.fullName);
      }
    });
  }, []);

  return (
    <Card withBorder shadow='sm' radius='md' p='lg' mb='md'>
      <Stack gap='xs'>
        <Group justify='space-between'>
          <Title order={3}>{props.name}</Title>
          <Text fs='italic'>{fullName}</Text>
        </Group>
        <Divider />
        <Group justify='space-between'>
          <Text size='sm' c='dimmed'>
            📝 {t('reportsPage.headerDailyNotesCount')}:{' '}
            <strong>{props.dailyNoteCount}</strong>
          </Text>
          <Text size='sm' c='dimmed'>
            📅 <strong>{props.startDate}</strong> -{' '}
            <strong>{props.endDate}</strong>
          </Text>
        </Group>
      </Stack>
    </Card>
  );
}

export default ReportHeader;
