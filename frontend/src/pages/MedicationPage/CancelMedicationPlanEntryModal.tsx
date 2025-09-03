import { Modal, Stack, Group, Button, Textarea, Alert } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useState } from 'react';
import { MedicationPlanEntry } from '../../Types';
import axiosInstance from '../../lib/axiosInstance';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { useUserSettings } from '../../stores/useUserSettingsStore';

interface Props {
  opened: boolean;
  onClose: () => void;
  onSave: () => void;

  medicationPlanEntryToCancel: MedicationPlanEntry;
}

function CancelMedicationPlanEntryModal(props: Props) {
  const { t } = useTranslation();
  const dateFormat = useUserSettings((state) => state.dateFormat);

  const [endDate, setEndDate] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const [stoppedReason, setStoppedReason] = useState<string>('');

  function cancelMedicationPlanEntry() {
    const medicationPlanEntryToUpdate = props.medicationPlanEntryToCancel;

    medicationPlanEntryToUpdate.endDate = endDate;
    medicationPlanEntryToUpdate.stoppedReason = stoppedReason;

    axiosInstance
      .put(`/MedicationPlanEntries/${props.medicationPlanEntryToCancel.id}`, {
        endDate: endDate,
        notes: medicationPlanEntryToUpdate.notes,
        stoppedReason: stoppedReason,
      })
      .then(() => {
        props.onSave();
      });
  }

  return (
    <Modal
      opened={props.opened}
      onClose={() => props.onClose()}
      title={t('medicationsPage.medicationPlan.cancelModal.title')}
    >
      <Stack>
        <Alert variant='light' color='blue'>
          {t('medicationsPage.medicationPlan.cancelModal.infoText')}
        </Alert>

        <DatePickerInput
          label={t('medicationsPage.medicationPlan.endDate')}
          withAsterisk
          value={endDate}
          valueFormat={dateFormat}
          onChange={(e) => {
            if (e) {
              setEndDate(e);
            }
          }}
        />
        <Textarea
          label={t('medicationsPage.medicationPlan.cancelModal.reason')}
          value={stoppedReason}
          onChange={(e) => setStoppedReason(e.target.value)}
        />
      </Stack>

      <Group mt={20}>
        <Button
          onClick={() => {
            cancelMedicationPlanEntry();
          }}
        >
          {t('medicationsPage.medicationPlan.cancelModal.stopButton')}
        </Button>

        <Button variant='outline' onClick={() => props.onClose()}>
          {t('medicationsPage.medicationPlan.cancelModal.cancelButton')}
        </Button>
      </Group>
    </Modal>
  );
}

export default CancelMedicationPlanEntryModal;
