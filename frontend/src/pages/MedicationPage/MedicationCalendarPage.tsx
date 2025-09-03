import { useEffect, useState } from 'react';
import WeekPicker from '../DiaryPage/WeekPicker';
import { Center, em, Paper, SimpleGrid, Stack, Text } from '@mantine/core';
import MedicationCalendarDay from './MedicationCalendarDay';
import { useMediaQuery } from '@mantine/hooks';
import { startOfWeek } from '../DiaryPage/WeekPickerUtils';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { useUserSettings } from '../../stores/useUserSettingsStore';

const weekDayKeys = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

function MedicationCalendarPage() {
  const { t } = useTranslation();
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
  const dateFormat = useUserSettings((state) => state.dateFormat);

  const [selectedWeek, setSelectedWeek] = useState<string>(
    dayjs().format('YYYY-MM-DD')
  );
  const [dates, setDates] = useState<string[]>([]);

  useEffect(() => {
    const startDate = startOfWeek(selectedWeek);

    const allDatesForWeek = [];
    for (let i = 0; i < 7; i++) {
      allDatesForWeek.push(dayjs(startDate).add(i, 'day').format('YYYY-MM-DD'));
    }

    setDates(allDatesForWeek);
  }, [selectedWeek]);

  return (
    <>
      <Stack>
        <Center>
          <WeekPicker
            selectedWeek={selectedWeek}
            onSelectedWeekChange={(newDate) => setSelectedWeek(newDate)}
          />
        </Center>

        <SimpleGrid cols={isMobile ? 1 : 7} spacing='xs' verticalSpacing='xl'>
          {dates.map((date, index) => (
            <Paper withBorder p={5} key={index}>
              <Text size='lg'>
                {t(`days.${weekDayKeys[index]}`)}:{' '}
                {dayjs(date).format(dateFormat)}
              </Text>
              <MedicationCalendarDay date={date} />
            </Paper>
          ))}
        </SimpleGrid>
      </Stack>
    </>
  );
}

export default MedicationCalendarPage;
