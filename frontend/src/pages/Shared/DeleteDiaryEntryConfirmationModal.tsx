import { Modal, Alert, Group, Button } from '@mantine/core';
import { t } from 'i18next';
import { DailyNote } from '../../Types';
import dayjs from 'dayjs';
import axiosInstance from '../../lib/axiosInstance';

interface Props {
  opened: boolean;
  onClose: () => void;
  onDelete?: () => void;
  dailyNote: DailyNote | undefined;
}

function DeleteDiaryEntryConfirmationModal(props: Props) {
  function deleteDailyNote() {
    if (props.dailyNote?.id !== undefined) {
      axiosInstance
        .delete('DailyNotes/' + props.dailyNote.id)
        .then(() => {
          if (props.onDelete) props.onDelete();
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }

  return (
    <Modal
      opened={props.opened}
      onClose={props.onClose}
      title={t('diaryPage.diaryEntry.deleteConfirmationModal.modalTitle')}
      centered
    >
      <Alert color='red' variant='light'>
        {t('diaryPage.diaryEntry.deleteConfirmationModal.modalText', {
          date: dayjs(props.dailyNote?.date).format(
            t('diaryPage.diaryEntry.dates.format')
          ),
        })}
      </Alert>

      <Group gap={12} mt='lg'>
        <Button
          color='red'
          onClick={() => {
            deleteDailyNote();
            props.onClose();
          }}
        >
          {t('diaryPage.diaryEntry.deleteConfirmationModal.deleteButton')}
        </Button>
        <Button onClick={() => props.onClose()} variant='outline'>
          {t('diaryPage.diaryEntry.deleteConfirmationModal.cancelButton')}
        </Button>
      </Group>
    </Modal>
  );
}

export default DeleteDiaryEntryConfirmationModal;
