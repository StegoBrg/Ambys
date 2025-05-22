// Mostly copied from https://mantine.dev/dates/calendar/#custom-date-pickers
import { useEffect, useState } from 'react';
import { Calendar } from '@mantine/dates';
import { Group, ActionIcon, Popover, Button } from '@mantine/core';
import { TbChevronLeft, TbChevronRight } from 'react-icons/tb';
import { useTranslation } from 'react-i18next';
import {
  addDays,
  startOfWeek,
  endOfWeek,
  isInWeekRange,
} from './WeekPickerUtils';

interface Props {
  selectedWeek: Date;
  onSelectedWeekChange: (newDate: Date) => void;
}

function WeekPicker(props: Props) {
  const { t } = useTranslation();

  const [hovered, setHovered] = useState<Date | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<Date>(props.selectedWeek);

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
    props.onSelectedWeekChange(selectedWeek);
  }, [props, selectedWeek]);

  return (
    <>
      <Group>
        <ActionIcon
          variant='subtle'
          size='lg'
          onClick={() => {
            setSelectedWeek(addDays(selectedWeek, -7));
          }}
        >
          <TbChevronLeft size={30} />
        </ActionIcon>

        <Popover>
          <Popover.Target>
            <Button variant='subtle' color='gray'>
              {addDays(startOfWeek(selectedWeek), 1).toLocaleString(locale, {
                year: '2-digit',
                month: '2-digit',
                day: '2-digit',
              })}{' '}
              -{' '}
              {endOfWeek(selectedWeek).toLocaleString(locale, {
                year: '2-digit',
                month: '2-digit',
                day: '2-digit',
              })}
            </Button>
          </Popover.Target>
          <Popover.Dropdown>
            <Calendar
              locale={locale}
              withCellSpacing={false}
              getDayProps={(date) => {
                const isHovered = isInWeekRange(date, hovered);
                const isSelected = isInWeekRange(date, selectedWeek);
                const isInRange = isHovered || isSelected;
                return {
                  onMouseEnter: () => setHovered(date),
                  onMouseLeave: () => setHovered(null),
                  inRange: isInRange,
                  firstInRange: isInRange && date.getDay() === 1,
                  lastInRange: isInRange && date.getDay() === 0,
                  selected: isSelected,
                  onClick: () => setSelectedWeek(date),
                };
              }}
            />
          </Popover.Dropdown>
        </Popover>

        <ActionIcon
          variant='subtle'
          size='lg'
          onClick={() => {
            setSelectedWeek(addDays(selectedWeek, 7));
          }}
        >
          <TbChevronRight size={30} />
        </ActionIcon>
      </Group>
    </>
  );
}

export default WeekPicker;
