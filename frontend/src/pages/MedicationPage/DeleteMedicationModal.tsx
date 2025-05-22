import { Alert, Button, Group, Modal } from '@mantine/core';
import axiosInstance from '../../lib/axiosInstance';
import { Medication } from '../../Types';
import { useTranslation } from 'react-i18next';

interface Props {
  opened: boolean;
  onClose: () => void;
  onDelete: () => void;

  medicationToDelete: Medication;
}

function DeleteMedicationModel(props: Props) {
  const { t } = useTranslation();

  function deleteMedication() {
    axiosInstance
      .delete(`medications/${props.medicationToDelete.id}`)
      .then(() => {
        props.onDelete();
        props.onClose();
      });
  }

  return (
    <Modal
      opened={props.opened}
      onClose={() => props.onClose()}
      title={t('medicationsPage.medicationList.deleteModal.modalTitle')}
    >
      <Alert variant='light' color='red'>
        {t('medicationsPage.medicationList.deleteModal.modalText', {
          medicationName: props.medicationToDelete.name,
        })}
      </Alert>

      <Group mt={20}>
        <Button onClick={deleteMedication} color='red'>
          {t('medicationsPage.medicationList.deleteModal.deleteButton')}
        </Button>
        <Button variant='outline' onClick={() => props.onClose()}>
          {t('medicationsPage.medicationList.deleteModal.cancelButton')}
        </Button>
      </Group>
    </Modal>
  );
}

export default DeleteMedicationModel;
