import { Modal } from '@mantine/core';
import DiaryEntry from '../Shared/DiaryEntry';
import { NoteAttribute, NoteConfiguration } from '../../Types';
import { useTranslation } from 'react-i18next';

interface Props {
  opened: boolean;
  onClose: () => void;
  noteConfig: NoteConfiguration;
  allAttributes: NoteAttribute[];
}

function NoteConfigPreviewDialog(props: Props) {
  const { t } = useTranslation();

  return (
    <Modal
      opened={props.opened}
      onClose={props.onClose}
      title={t('settingsPage.noteConfig.preview')}
      centered
    >
      <DiaryEntry
        state='show'
        noteConfig={props.noteConfig}
        allAttributes={props.allAttributes}
        hideEditDeleteIcons
      />
    </Modal>
  );
}

export default NoteConfigPreviewDialog;
