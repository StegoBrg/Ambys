import { Button, Modal, TextInput } from '@mantine/core';
import { Notebook, Page } from '../../Types';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../lib/axiosInstance';
import { useState } from 'react';

interface Props {
  opened: boolean;
  onClose: () => void;
  onRename: () => void;

  elementToRename: Notebook | Page;
}

function RenameModal(props: Props) {
  const { t } = useTranslation();

  const [newName, setNewName] = useState<string>('');

  function renameNotebookOrPage(element: Notebook | Page) {
    if ('content' in element) {
      // Rename page
      axiosInstance
        .put('pages/' + element.id, {
          title: newName,
          content: element.content,
          parentId: element.parentId,
          notebookId: element.notebookId,
        })
        .then(() => {
          props.onRename();
        });
    } else {
      // Rename notebook
      axiosInstance
        .put('notebooks/' + element.id, {
          title: newName,
        })
        .then(() => {
          props.onRename();
        });
    }
  }

  return (
    <Modal
      opened={props.opened}
      onClose={props.onClose}
      title={t('settingsPage.noteAttributes.renameButton')}
      centered
    >
      <TextInput
        label={t('settingsPage.noteAttributes.renameTitle')}
        placeholder={t('settingsPage.noteAttributes.renamePlaceholder')}
        value={newName}
        onChange={(e) => setNewName(e.currentTarget.value)}
        size='xs'
      />

      <Button
        mt={10}
        size='compact-md'
        onClick={() => {
          renameNotebookOrPage(props.elementToRename);
          props.onClose();
        }}
      >
        {t('settingsPage.noteAttributes.renameButton')}
      </Button>
    </Modal>
  );
}

export default RenameModal;
