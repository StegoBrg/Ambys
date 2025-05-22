import dayjs from 'dayjs';

function getDay(date: Date) {
  const day = date.getDay();
  return day === 0 ? 6 : day - 1;
}

function startOfWeek(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - getDay(date) - 1
  );
}

function endOfWeek(date: Date) {
  return dayjs(
    new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + (6 - getDay(date))
    )
  )
    .endOf('date')
    .toDate();
}

function isInWeekRange(date: Date, value: Date | null) {
  return value
    ? dayjs(date).isBefore(endOfWeek(value)) &&
        dayjs(date).isAfter(startOfWeek(value))
    : false;
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export { getDay, startOfWeek, endOfWeek, isInWeekRange, addDays };
