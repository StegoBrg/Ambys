import { useEffect, useState } from 'react';
import axiosInstance from '../../lib/axiosInstance';
import { Medication, MedicationPlanEntry } from '../../Types';
import { Text, Card, Stack } from '@mantine/core';

interface Props {
  date: Date;
}

type MedicationWithTime = {
  id: number;
  dosage: string;
  medication: Medication;
  notes?: string;
  timeOfDay: string;
};

function MedicationCalendarDay(props: Props) {
  const [medicationForDay, setMedicationForDay] = useState<
    MedicationWithTime[]
  >([]);

  useEffect(() => {
    // Deal with time zone issues.
    const offsetStart = props.date.getTimezoneOffset();
    const dateObj = new Date(props.date.getTime() - offsetStart * 60 * 1000);
    const dateString: string = dateObj.toISOString().split('T')[0];

    axiosInstance
      .get<MedicationPlanEntry[]>(`medicationPlanEntries/date/${dateString}`)
      .then((response) => {
        // Create a new array with an entry for each timeOfDay.
        const mediactionsWithTime: MedicationWithTime[] = [];
        response.data.forEach((entry) => {
          entry.schedule?.timesOfDay.forEach((time) => {
            const medicationWithTime: MedicationWithTime = {
              id: entry.id,
              dosage: entry.dosage,
              medication: entry.medication,
              notes: entry.notes,
              timeOfDay: time,
            };
            mediactionsWithTime.push(medicationWithTime);
          });
        });

        const sortedByTime = mediactionsWithTime.sort((a, b) => {
          return a.timeOfDay.localeCompare(b.timeOfDay);
        });

        setMedicationForDay(sortedByTime);
      });
  }, [props.date]);

  return (
    <>
      <Stack gap='xs'>
        {medicationForDay.map((entry, index) => (
          <Card shadow='sm' p='md' key={index}>
            <Stack>
              <Text size='lg' c='blue'>
                {entry.timeOfDay.slice(0, 5)}
              </Text>
              <Text>{entry.medication.name}</Text>
              <Text size='sm' c='dimmed'>
                {entry.dosage} - {entry.medication.strength} (
                {entry.medication.type})
              </Text>
              {entry.notes && (
                <Text size='xs' c='dimmed'>
                  {entry.notes}
                </Text>
              )}
            </Stack>
          </Card>
        ))}
      </Stack>
    </>
  );
}

export default MedicationCalendarDay;
