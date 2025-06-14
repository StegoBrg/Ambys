import dayjs from 'dayjs';

function getFirstDaysOfMonths(startDate: Date, endDate: Date): Date[] {
  const result: Date[] = [];

  let current = dayjs(startDate).startOf('month');
  const end = dayjs(endDate).startOf('month');

  while (current.isBefore(end) || current.isSame(end)) {
    result.push(current.toDate());
    current = current.add(1, 'month');
  }

  return result;
}

export { getFirstDaysOfMonths };
