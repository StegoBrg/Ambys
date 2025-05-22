import { Alert, Button, Group, Modal } from '@mantine/core';
import { Notebook, Page } from '../../Types';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../lib/axiosInstance';

interface Props {
  opened: boolean;
  onClose: () => void;
  onDelete: () => void;

  elementToDelete: Notebook | Page;
}

function DeleteConfirmationModal(props: Props) {
  const { t } = useTranslation();

  const elementString =
    'content' in props.elementToDelete ? 'Page' : 'Notebook';

  function deleteNotebookOrElement(element: Notebook | Page) {
    if ('content' in props.elementToDelete) {
      // Delete page
      axiosInstance.delete('pages/' + element.id).then(() => {
        props.onDelete();
      });
    } else {
      // Delete notebook
      axiosInstance.delete('notebooks/' + element.id).then(() => {
        props.onDelete();
      });
    }
  }

  return (
    <Modal
      opened={props.opened}
      onClose={props.onClose}
      title={t('notebooksPage.deleteConfirmationModal.modalTitle')}
      centered
    >
      <Alert color='red' variant='light'>
        {t('notebooksPage.deleteConfirmationModal.modalText', {
          element: t(`notebooksPage.addModal.${elementString.toLowerCase()}`),
          name: props.elementToDelete.title,
        })}
      </Alert>

      <Group gap={12} mt='lg'>
        <Button
          color='red'
          onClick={() => {
            deleteNotebookOrElement(props.elementToDelete);
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
