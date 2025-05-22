import { Modal, Group, Button, Textarea } from '@mantine/core';
import { useState } from 'react';
import { MedicationPlanEntry } from '../../Types';
import axiosInstance from '../../lib/axiosInstance';
import { useTranslation } from 'react-i18next';

interface Props {
  opened: boolean;
  onClose: () => void;
  onSave: () => void;

  medicationPlanEntryToEdit: MedicationPlanEntry;
}

function EditMedicationPlanEntryModal(props: Props) {
  const { t } = useTranslation();

  const [notes, setNotes] = useState(
    props.medicationPlanEntryToEdit.notes ?? ''
  );

  function editMedicationPlanEntry() {
    axiosInstance
      .put(`/MedicationPlanEntries/${props.medicationPlanEntryToEdit.id}`, {
        endDate: props.medicationPlanEntryToEdit.endDate,
        notes: notes,
        stoppedReason: props.medicationPlanEntryToEdit.stoppedReason,
      })
      .then(() => {
        props.onSave();
      });
  }

  return (
    <Modal
      opened={props.opened}
      onClose={() => props.onClose()}
      title={t('medicationsPage.medicationPlan.editModal.title')}
    >
      <Textarea
        label={t('medicationsPage.medicationPlan.notes')}
        value={notes}
        onChange={(e) => {
          setNotes(e.target.value);
        }}
      />

      <Group mt={20}>
        <Button
          onClick={() => {
            editMedicationPlanEntry();
          }}
        >
          {t('medicationsPage.medicationPlan.editModal.saveButton')}
        </Button>

        <Button variant='outline' onClick={() => props.onClose()}>
          {t('medicationsPage.medicationPlan.editModal.cancelButton')}
        </Button>
      </Group>
    </Modal>
  );
}

export default EditMedicationPlanEntryModal;
