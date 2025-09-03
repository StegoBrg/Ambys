import { Card, Group, Text, Title, Divider, Stack } from '@mantine/core';
import { useEffect, useState } from 'react';
import axiosInstance from '../../lib/axiosInstance';
import { UserData } from '../../Types';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { useUserSettings } from '../../stores/useUserSettingsStore';
import { TbCalendar, TbNotes } from 'react-icons/tb';

interface Props {
  name: string;
  dailyNoteCount: number;
  startDate: string; // or Date
  endDate: string; // or Date
}

function ReportHeader(props: Props) {
  const { t } = useTranslation();
  const dateFormat = useUserSettings((state) => state.dateFormat);

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
            <TbNotes /> {t('reportsPage.headerDailyNotesCount')}:{' '}
            <strong>{props.dailyNoteCount}</strong>
          </Text>
          <Text size='sm' c='dimmed'>
            <TbCalendar />{' '}
            <strong>{dayjs(props.startDate).format(dateFormat)}</strong> -{' '}
            <strong>{dayjs(props.endDate).format(dateFormat)}</strong>
          </Text>
        </Group>
      </Stack>
    </Card>
  );
}

export default ReportHeader;
