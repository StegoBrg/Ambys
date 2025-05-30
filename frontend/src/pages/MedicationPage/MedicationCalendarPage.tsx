import { useEffect, useState } from 'react';
import WeekPicker from '../DiaryPage/WeekPicker';
import { Center, em, Paper, SimpleGrid, Stack, Text } from '@mantine/core';
import MedicationCalendarDay from './MedicationCalendarDay';
import { useMediaQuery } from '@mantine/hooks';
import { startOfWeek } from '../DiaryPage/WeekPickerUtils';
import { useTranslation } from 'react-i18next';

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

  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [dates, setDates] = useState<Date[]>([]);
  const [locale, setLocale] = useState('en');

  // Update locale if string is loaded from i18next.
  useEffect(() => {
    const checkLocaleLoaded = () => {
      const loadedLocale = t('diaryPage.diaryEntry.dates.dayjsLocale');
      if (loadedLocale !== 'diaryPage.diaryEntry.dates.dayjsLocale') {
        setLocale(loadedLocale);
      } else {
        setLocale('en');
      }
    };

    checkLocaleLoaded();
  }, [t]);

  useEffect(() => {
    let startDate = startOfWeek(selectedWeek);

    // Deal with time zone issues.
    const offsetStart = startDate.getTimezoneOffset();
    startDate = new Date(startDate.getTime() - offsetStart * 60 * 1000);

    const allDatesForWeek = [];
    for (let i = 1; i <= 7; i++) {
      allDatesForWeek.push(addDays(startDate, i));
    }

    setDates(allDatesForWeek);
  }, [selectedWeek]);

  function addDays(date: Date, days: number) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

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
                {t(`days.${weekDayKeys[index]}`)},{' '}
                {date.toLocaleDateString(locale)}
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
