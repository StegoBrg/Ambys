// Mostly copied from https://mantine.dev/dates/calendar/#custom-date-pickers
import dayjs from 'dayjs';
import { useState } from 'react';
import { Calendar } from '@mantine/dates';
import { Group, ActionIcon, Popover, Button } from '@mantine/core';
import { TbChevronLeft, TbChevronRight } from 'react-icons/tb';
import { startOfWeek, endOfWeek, isInWeekRange } from './WeekPickerUtils';
import { useUserSettings } from '../../stores/useUserSettingsStore';

interface Props {
  selectedWeek: string;
  onSelectedWeekChange: (newDate: string) => void;
}

function WeekPicker(props: Props) {
  const dateFormat = useUserSettings((state) => state.dateFormat);

  const [hovered, setHovered] = useState<string | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<string>(props.selectedWeek);

  return (
    <>
      <Group>
        <ActionIcon
          variant='subtle'
          size='lg'
          onClick={() => {
            const selectedWeekTemp = dayjs(selectedWeek)
              .subtract(1, 'week')
              .format('YYYY-MM-DD');
            setSelectedWeek(selectedWeekTemp);

            props.onSelectedWeekChange(selectedWeekTemp);
          }}
        >
          <TbChevronLeft size={30} />
        </ActionIcon>

        <Popover>
          <Popover.Target>
            <Button variant='subtle' color='gray'>
              {dayjs(startOfWeek(selectedWeek)).format(dateFormat)} -{' '}
              {dayjs(endOfWeek(selectedWeek)).format(dateFormat)}
            </Button>
          </Popover.Target>
          <Popover.Dropdown>
            <Calendar
              withCellSpacing={false}
              getDayProps={(date) => {
                const isHovered = isInWeekRange(date, hovered);
                const isSelected = isInWeekRange(date, selectedWeek);
                const isInRange = isHovered || isSelected;
                return {
                  onMouseEnter: () => setHovered(date),
                  onMouseLeave: () => setHovered(null),
                  inRange: isInRange,
                  firstInRange: isInRange && new Date(date).getDay() === 1,
                  lastInRange: isInRange && new Date(date).getDay() === 0,
                  selected: isSelected,
                  onClick: () => {
                    setSelectedWeek(date);
                    props.onSelectedWeekChange(date);
                  },
                };
              }}
            />
          </Popover.Dropdown>
        </Popover>
        <ActionIcon
          variant='subtle'
          size='lg'
          onClick={() => {
            const selectedWeekTemp = dayjs(selectedWeek)
              .add(1, 'week')
              .format('YYYY-MM-DD');
            setSelectedWeek(selectedWeekTemp);

            props.onSelectedWeekChange(selectedWeekTemp);
          }}
        >
          <TbChevronRight size={30} />
        </ActionIcon>
      </Group>
    </>
  );
}

export default WeekPicker;
