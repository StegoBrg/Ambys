import dayjs from 'dayjs';

function addDays(date: string, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function getDay(date: string) {
  const day = dayjs(date).day();
  return day === 0 ? 6 : day - 1;
}

function startOfWeek(date: string) {
  return dayjs(date)
    .subtract(getDay(date), 'day')
    .format('YYYY-MM-DD');
}

function endOfWeek(date: string) {
  return dayjs(date)
    .add(6 - getDay(date), 'day')
    .endOf('day')
    .format('YYYY-MM-DD');
}

function isInWeekRange(date: string, value: string | null) {
  if (!value) return false;

  const d = dayjs(date);
  const start = startOfWeek(value);
  const end = endOfWeek(value);

  return (d.isSame(start) || d.isAfter(start)) && (d.isSame(end) || d.isBefore(end));
}

export { getDay, startOfWeek, endOfWeek, isInWeekRange, addDays };
