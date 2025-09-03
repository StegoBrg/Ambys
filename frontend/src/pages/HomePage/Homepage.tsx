import { Center, Paper, Title } from '@mantine/core';
import MedicationCalendarDay from '../MedicationPage/MedicationCalendarDay';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

function Homepage() {
  const { t } = useTranslation();

  return (
    <Center>
      <Paper withBorder p={10} mt={30} w='80%'>
        <Title order={3} mb={20}>
          {t('homepage.medicationTitle')}
        </Title>

        <MedicationCalendarDay date={dayjs().format('YYYY-MM-DD')} />
      </Paper>
    </Center>
  );
}

export default Homepage;
