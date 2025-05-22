import {
  Modal,
  Stack,
  TextInput,
  Group,
  Button,
  Select,
  MultiSelect,
  NumberInput,
  Textarea,
  Checkbox,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useEffect, useState } from 'react';
import { Medication } from '../../Types';
import axiosInstance from '../../lib/axiosInstance';
import { useTranslation } from 'react-i18next';

interface Props {
  opened: boolean;
  onClose: () => void;
  onSave: () => void;

  medicationList: Medication[];
}

function AddMedicationPlanEntryModal(props: Props) {
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

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [medication, setMedication] = useState<Medication | null>(null);
  const [dosage, setDosage] = useState<string>('');
  const [isAsNeeded, setIsAsNeeded] = useState<boolean>(false);
  const [timesOfDay, setTimesOfDay] = useState<string>('08:00'); // List of times in 24h format, separated by commas (e.g. "08:00,12:00")
  const [type, setType] = useState<string>('Daily');

  const [customDays, setCustomDays] = useState<string[]>([]); // Array of selected days for "CustomDays" type (e.g. ["Monday", "Tuesday"])
  const [everyXDays, setEveryXDays] = useState<number | null>(null); // Number of days for "EveryXDays" type
  const [everyXWeeks, setEveryXWeeks] = useState<number | null>(null); // Number of weeks for "EveryXWeeks" type

  const [notes, setNotes] = useState<string>(''); // Notes for the medication plan entry

  function addMedicationPlanEntry() {
    // Make sure required fields are filled
    if (!startDate || !medication || !dosage || !timesOfDay || !type) {
      return;
    }

    // Deal with time zone issues.
    const offsetStart = startDate.getTimezoneOffset();
    const startDateDate = new Date(
      startDate.getTime() - offsetStart * 60 * 1000
    );
    const startDateString: string = startDateDate.toISOString().split('T')[0];

    let endDateString: string | null = null;
    if (endDate) {
      const offsetEnd = endDate.getTimezoneOffset();
      const endDateDate = new Date(endDate.getTime() - offsetEnd * 60 * 1000);
      endDateString = endDateDate.toISOString().split('T')[0];
    }

    axiosInstance
      .post('/MedicationPlanEntries', {
        medicationId: medication.id,
        dosage: dosage,
        startDate: startDateString,
        endDate: endDateString,
        isAsNeeded: isAsNeeded,
        schedule: isAsNeeded
          ? null
          : {
              type: type,
              timesOfDay: timesOfDay.split(','),
              daysOfWeek: customDays,
              intervalDays: everyXDays,
              intervalWeeks: everyXWeeks,
            },
        notes: notes,
        stoppedReason: null,
      })
      .then(() => {
        props.onSave();
        // Reset all fields
        setStartDate(new Date());
        setEndDate(null);
        setMedication(null);
        setDosage('');
        setIsAsNeeded(false);
        setTimesOfDay('08:00');
        setType('Daily');
        setCustomDays([]);
        setEveryXDays(null);
        setEveryXWeeks(null);
        setNotes('');
      });
  }

  return (
    <Modal
      opened={props.opened}
      onClose={() => props.onClose()}
      title={t('medicationsPage.medicationPlan.addModal.title')}
    >
      <Stack>
        <Group justify='space-between' grow>
          <DatePickerInput
            label={t('medicationsPage.medicationPlan.startDate')}
            placeholder={''}
            withAsterisk
            highlightToday
            value={startDate}
            locale={locale}
            onChange={(e) => {
              if (e) setStartDate(e);
            }}
          />
          <DatePickerInput
            label={t('medicationsPage.medicationPlan.endDate')}
            placeholder={''}
            highlightToday
            value={endDate}
            locale={locale}
            onChange={(e) => {
              if (e) setEndDate(e);
            }}
          />
        </Group>

        <Group justify='space-between' grow>
          <Select
            label={t('medicationsPage.medicationPlan.medication')}
            data={props.medicationList.map(
              (med) => `${med.name} (${med.strength})`
            )}
            withAsterisk
            value={
              medication !== null
                ? `${medication.name} (${medication.strength})`
                : null
            }
            onChange={(e) => {
              if (e) {
                // Get medication name from the selected value
                const name = e.match(/^(.*)\s\(\d.*\)$/)?.[1];
                setMedication(
                  props.medicationList.find((med) => med.name === name) ?? null
                );
              }
            }}
          />
          <TextInput
            label={t('medicationsPage.medicationPlan.dosage')}
            placeholder={t(
              'medicationsPage.medicationPlan.addModal.dosagePlaceholder'
            )}
            withAsterisk
            value={dosage}
            onChange={(e) => setDosage(e.currentTarget.value)}
          />
        </Group>

        <Checkbox
          label={t('medicationsPage.medicationPlan.addModal.asNeeded')}
          checked={isAsNeeded}
          onChange={(e) => {
            setIsAsNeeded(e.target.checked);
          }}
        />

        {!isAsNeeded && (
          <>
            <TextInput
              label={t(
                'medicationsPage.medicationPlan.addModal.timesOfDayLabel'
              )}
              placeholder={'08:00,18:00'}
              withAsterisk
              value={timesOfDay}
              onChange={(e) => {
                setTimesOfDay(e.currentTarget.value);
              }}
              error={
                timesOfDay.match(
                  /^(?:[01]\d|2[0-3]):[0-5]\d(?:,(?:[01]\d|2[0-3]):[0-5]\d)*$/
                )
                  ? null
                  : t('medicationsPage.medicationPlan.addModal.timesOfDayError')
              }
            />
            <Select
              label={t('medicationsPage.medicationPlan.type')}
              data={[
                {
                  value: 'Daily',
                  label: t(
                    'medicationsPage.medicationPlan.addModal.types.daily'
                  ),
                },
                {
                  value: 'CustomDays',
                  label: t(
                    'medicationsPage.medicationPlan.addModal.types.customDays'
                  ),
                },
                {
                  value: 'EveryXDays',
                  label: t(
                    'medicationsPage.medicationPlan.addModal.types.everyXDays'
                  ),
                },
                {
                  value: 'EveryXWeeks',
                  label: t(
                    'medicationsPage.medicationPlan.addModal.types.everyXWeeks'
                  ),
                },
              ]}
              withAsterisk
              value={type}
              allowDeselect={false}
              onChange={(e) => {
                if (e) {
                  setType(e);
                }
              }}
            />
          </>
        )}

        {!isAsNeeded && type === 'CustomDays' && (
          <MultiSelect
            label={t('medicationsPage.medicationPlan.addModal.customDays')}
            data={[
              { value: 'Monday', label: t('days.monday') },
              { value: 'Tuesday', label: t('days.tuesday') },
              { value: 'Wednesday', label: t('days.wednesday') },
              { value: 'Thursday', label: t('days.thursday') },
              { value: 'Friday', label: t('days.friday') },
              { value: 'Saturday', label: t('days.saturday') },
              { value: 'Sunday', label: t('days.sunday') },
            ]}
            withAsterisk
            value={customDays}
            onChange={(e) => {
              setCustomDays(e);
            }}
          />
        )}

        {!isAsNeeded && type === 'EveryXDays' && (
          <NumberInput
            label={t('medicationsPage.medicationPlan.addModal.everyXDays')}
            allowNegative={false}
            allowDecimal={false}
            withAsterisk
            value={everyXDays ?? undefined}
            onChange={(e) => {
              setEveryXDays(+e);
            }}
          />
        )}

        {!isAsNeeded && type === 'EveryXWeeks' && (
          <NumberInput
            label={t('medicationsPage.medicationPlan.addModal.everyXWeeks')}
            allowNegative={false}
            allowDecimal={false}
            withAsterisk
            value={everyXWeeks ?? undefined}
            onChange={(e) => {
              setEveryXWeeks(+e);
            }}
          />
        )}

        <Textarea
          label={t('medicationsPage.medicationPlan.notes')}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </Stack>

      <Group mt={20}>
        <Button
          onClick={() => {
            addMedicationPlanEntry();
          }}
          disabled={
            !startDate ||
            !medication ||
            !dosage ||
            !timesOfDay ||
            timesOfDay.length === 0 ||
            !type
          }
        >
          {t('medicationsPage.medicationPlan.addModal.addButton')}
        </Button>

        <Button variant='outline' onClick={() => props.onClose()}>
          {t('medicationsPage.medicationPlan.addModal.cancelButton')}
        </Button>
      </Group>
    </Modal>
  );
}

export default AddMedicationPlanEntryModal;
