import { Alert, Button, Group, Modal } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../lib/axiosInstance';
import { HealthReport } from './Types';

interface Props {
  opened: boolean;
  onClose: () => void;
  onDelete: () => void;

  elementToDelete: HealthReport;
}

function DeleteConfirmationModal(props: Props) {
  const { t } = useTranslation();

  function deleteReport() {
    axiosInstance
      .delete('HealthReportConfigs/' + props.elementToDelete.id)
      .then(() => {
        props.onDelete();
        props.onClose();
      });
  }

  return (
    <Modal
      opened={props.opened}
      onClose={props.onClose}
      title='Confirm Delete'
      centered
    >
      <Alert color='red' variant='light'>
        Do you really want to delete? This cannot be undone!
      </Alert>

      <Group gap={12} mt='lg'>
        <Button
          color='red'
          onClick={() => {
            deleteReport();
            props.onClose();
          }}
        >
          {t('notebooksPage.deleteConfirmationModal.deleteButton')}
        </Button>
        <Button onClick={() => props.onClose()} variant='outline'>
          {t('notebooksPage.deleteConfirmationModal.cancelButton')}
        </Button>
      </Group>
    </Modal>
  );
}

export default DeleteConfirmationModal;
