import {
  Modal,
  Stack,
  Group,
  Button,
  Textarea,
  Title,
  Divider,
  Select,
  Checkbox,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  opened: boolean;
  onClose: () => void;
}

function GenerateReportModal(props: Props) {
  const { t } = useTranslation();
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

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const [startDate, setStartDate] = useState<Date>(oneMonthAgo);
  const [endDate, setEndDate] = useState<Date>(new Date());

  return (
    <Modal
      opened={props.opened}
      onClose={() => props.onClose()}
      title='Generate Report'
    >
      <Group grow>
        <DatePickerInput
          label='Start Date'
          withAsterisk
          value={startDate}
          locale={locale}
          onChange={(e) => {
            if (e) {
              setStartDate(e);
            }
          }}
        />

        <DatePickerInput
          label='End Date'
          withAsterisk
          value={endDate}
          locale={locale}
          onChange={(e) => {
            if (e) {
              setEndDate(e);
            }
          }}
        />
      </Group>

      <Stack mt={20} gap='lg'>
        <div>
          <Title order={4}>Attributes</Title>
          <Divider />

          <Group grow>
            <Select label='Attribute' />
            <Select
              label='Visualition'
              data={['show all', 'average', 'min', 'aggregate', 'lineChart']} // Example visualizations. NOT complete.
            />
          </Group>
        </div>

        <div>
          <Title order={4}>Calendar View</Title>
          <Divider />
          {/* Reuse color coded calendar view here */}
        </div>

        <div>
          <Title order={4}>Medication</Title>
          <Divider />
          <Checkbox label={'Include Medication List'} checked={true} readOnly />
        </div>

        <Textarea
          label='Additional Notes'
          placeholder='Enter any additional notes for the report...'
          autosize
          minRows={3}
        />
      </Stack>

      <Group mt={20}>
        <Button onClick={() => {}}>Generate Report</Button>

        <Button variant='outline' onClick={() => props.onClose()}>
          Cancel
        </Button>
      </Group>
    </Modal>
  );
}

export default GenerateReportModal;
