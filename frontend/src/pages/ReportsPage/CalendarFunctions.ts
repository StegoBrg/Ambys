import dayjs from 'dayjs';

function getFirstDaysOfMonths(startDate: string, endDate: string): string[] {
  const result: string[] = [];

  let current = dayjs(startDate).startOf('month');
  const end = dayjs(endDate).startOf('month');

  while (current.isBefore(end) || current.isSame(end)) {
    result.push(current.format("YYYY-MM-DD"));
    current = current.add(1, 'month');
  }

  return result;
}

export { getFirstDaysOfMonths };
