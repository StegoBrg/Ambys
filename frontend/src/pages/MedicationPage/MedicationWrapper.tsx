import { Center, Tabs } from '@mantine/core';
import MedicationPage from './MedicationPage';
import MedicationPlanPage from './MedicationPlanPage';
import { useTranslation } from 'react-i18next';
import MedicationCalendarPage from './MedicationCalendarPage';

function MedicationWrapper() {
  const { t } = useTranslation();

  return (
    <>
      <Tabs defaultValue='medicationCalendar' keepMounted={false}>
        <Center>
          <Tabs.List m={20}>
            <Tabs.Tab value='medicationCalendar'>
              {t('medicationsPage.wrapper.calendar')}
            </Tabs.Tab>
            <Tabs.Tab value='medicationPlan'>
              {t('medicationsPage.wrapper.plan')}
            </Tabs.Tab>
            <Tabs.Tab value='medicationList'>
              {t('medicationsPage.wrapper.medicationList')}
            </Tabs.Tab>
          </Tabs.List>
        </Center>

        <Tabs.Panel value='medicationPlan'>
          <MedicationPlanPage />
        </Tabs.Panel>

        <Tabs.Panel value='medicationCalendar'>
          <MedicationCalendarPage />
        </Tabs.Panel>

        <Tabs.Panel value='medicationList'>
          <MedicationPage />
        </Tabs.Panel>
      </Tabs>
    </>
  );
}

export default MedicationWrapper;
