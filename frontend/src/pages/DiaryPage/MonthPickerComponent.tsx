import { Group, ActionIcon, Button, Popover } from '@mantine/core';
import { MonthPicker } from '@mantine/dates';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TbChevronLeft, TbChevronRight } from 'react-icons/tb';

interface Props {
  selectedMonth: string;
  onSelectedMonthChange: (newDate: string) => void;
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
          const selectedMonthTemp = dayjs(selectedMonth)
            .subtract(1, 'month')
            .format('YYYY-MM-DD');
          setSelectedMonth(selectedMonthTemp);
        }}
      >
        <TbChevronLeft size={30} />
      </ActionIcon>

      <Popover>
        <Popover.Target>
          <Button variant='subtle' color='gray'>
            {dayjs(selectedMonth).format('MMMM YYYY')}
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
          // TODO: Set locale with dayjs globally
          const selectedMonthTemp = dayjs(selectedMonth)
            .add(1, 'month')
            .format('YYYY-MM-DD');
          setSelectedMonth(selectedMonthTemp);
        }}
      >
        <TbChevronRight size={30} />
      </ActionIcon>
    </Group>
  );
}

export default MonthPickerComponent;
