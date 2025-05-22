import { Group, ActionIcon, Button, Popover } from '@mantine/core';
import { MonthPicker } from '@mantine/dates';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TbChevronLeft, TbChevronRight } from 'react-icons/tb';

interface Props {
  selectedMonth: Date;
  onSelectedMonthChange: (newDate: Date) => void;
}

function MonthPickerComponent(props: Props) {
  const { t } = useTranslation();

  const [selectedMonth, setSelectedMonth] = useState(props.selectedMonth);
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

  // Call onChange method from props every time internal state changes.
  useEffect(() => {
    props.onSelectedMonthChange(selectedMonth);
  }, [props, selectedMonth]);

  return (
    <Group>
      <ActionIcon
        variant='subtle'
        size='lg'
        onClick={() => {
          const selectedMonthTemp = new Date(selectedMonth);
          selectedMonthTemp.setMonth(selectedMonthTemp.getMonth() - 1);
          setSelectedMonth(selectedMonthTemp);
        }}
      >
        <TbChevronLeft size={30} />
      </ActionIcon>

      <Popover
      >
        <Popover.Target>
          <Button variant='subtle' color='gray'>
            {selectedMonth.toLocaleString(locale ?? 'en', {
              month: 'long',
            })}{' '}
            {selectedMonth.getFullYear().toString()}
          </Button>
        </Popover.Target>
        <Popover.Dropdown>
          <MonthPicker
            locale={locale}
            value={selectedMonth}
            onChange={(e) => {
              if (e) {
                setSelectedMonth(e);
              }
            }}
          />
        </Popover.Dropdown>
      </Popover>

      <ActionIcon
        variant='subtle'
        size='lg'
        onClick={() => {
          const selectedMonthTemp = new Date(selectedMonth);
          selectedMonthTemp.setMonth(selectedMonthTemp.getMonth() + 1);
          setSelectedMonth(selectedMonthTemp);
        }}
      >
        <TbChevronRight size={30} />
      </ActionIcon>
    </Group>
  );
}

export default MonthPickerComponent;
