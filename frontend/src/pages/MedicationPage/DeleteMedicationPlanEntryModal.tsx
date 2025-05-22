import { Modal, Group, Button, Alert } from '@mantine/core';
import { t } from 'i18next';
import { MedicationPlanEntry } from '../../Types';
import axiosInstance from '../../lib/axiosInstance';

interface Props {
  opened: boolean;
  onClose: () => void;
  onSave: () => void;

  medicationPlanEntryToDelete: MedicationPlanEntry;
}

function DeleteMedicationPlanEntryModal(props: Props) {
  function deleteMedicationPlanEntry() {
    axiosInstance
      .delete(`/MedicationPlanEntries/${props.medicationPlanEntryToDelete.id}`)
      .then(() => {
        props.onSave();
      });
  }

  return (
    <Modal
      opened={props.opened}
      onClose={() => props.onClose()}
      title={t('medicationsPage.medicationPlan.deleteModal.title')}
    >
      <Alert variant='light' color='red'>
        {t('medicationsPage.medicationPlan.deleteModal.warningText')}
      </Alert>

      <Group mt={20}>
        <Button
          onClick={() => {
            deleteMedicationPlanEntry();
          }}
        >
          {t('medicationsPage.medicationPlan.deleteModal.deleteButton')}
        </Button>

        <Button variant='outline' onClick={() => props.onClose()}>
          {t('medicationsPage.medicationPlan.deleteModal.cancelButton')}
        </Button>
      </Group>
    </Modal>
  );
}

export default DeleteMedicationPlanEntryModal;
