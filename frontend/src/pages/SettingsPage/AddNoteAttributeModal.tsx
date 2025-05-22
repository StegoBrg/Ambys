import {
  Box,
  Button,
  Divider,
  Modal,
  Select,
  Text,
  TextInput,
} from '@mantine/core';
import { NoteAttributeElement, NoteAttributeElements } from '../../Types';
import { useState } from 'react';
import Scale10 from '../Shared/NoteAttributeElements/Scale10';
import TextField from '../Shared/NoteAttributeElements/TextField';
import TextArea from '../Shared/NoteAttributeElements/TextArea';
import NumberInputEl from '../Shared/NoteAttributeElements/NumberInput';
import CheckBox from '../Shared/NoteAttributeElements/CheckBox';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../lib/axiosInstance';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

function AddNoteAttributeModal(props: Props) {
  const { t } = useTranslation();

  const [attributeName, setAttributeName] = useState('');
  const [elementType, setElementType] = useState<NoteAttributeElement | ''>('');

  function addAllNewAttributes() {
    if (attributeName === '' || elementType === '') {
      notifications.show({
        title: t('settingsPage.addNoteAttributeModal.saveToast.errorTitle'),
        message: t(
          'settingsPage.addNoteAttributeModal.saveToast.errorDescriptionEmpty'
        ),
        color: 'red',
        position: 'bottom-center',
      });
      return;
    }

    const attribute = {
      name: attributeName,
      element: elementType,
    };

    axiosInstance
      .post('NoteAttributes', attribute)
      .then(() => {
        props.onSave();
      })
      .catch((error) => {
        console.error('Error:', error);
        if (error.response) {
          notifications.show({
            title:
              t('settingsPage.addNoteAttributeModal.saveToast.errorTitle') +
              ` - ${error.response.status}`,
            message:
              t(
                'settingsPage.addNoteAttributeModal.saveToast.errorDescription'
              ) + `${error.response.data.message}`,
            color: 'red',
            position: 'bottom-center',
            autoClose: false,
          });
        }
      });
  }

  function getPreviewElement() {
    switch (elementType) {
      case 'scale10':
        return (
          <Scale10
            title={attributeName}
            value={0}
            onChange={() => {}}
            editable={true}
          />
        );

      case 'textarea':
        return (
          <TextArea
            title={attributeName}
            value=''
            onChange={() => {}}
            editable={true}
          />
        );

      case 'textfield':
        return (
          <TextField
            title={attributeName}
            value=''
            onChange={() => {}}
            editable={true}
          />
        );

      case 'numberinput':
        return (
          <NumberInputEl
            title={attributeName}
            value={0}
            onChange={() => {}}
            editable={true}
          />
        );

      case 'checkbox':
        return (
          <CheckBox
            title={attributeName}
            value={false}
            onChange={() => {}}
            editable={true}
          />
        );
    }
  }

  return (
    <Modal
      opened={props.open}
      onClose={props.onClose}
      title={t('settingsPage.addNoteAttributeModal.modalTitle')}
      centered
    >
      <TextInput
        placeholder={t('settingsPage.addNoteAttributeModal.nameTextfield')}
        label={t('settingsPage.addNoteAttributeModal.nameTextfield')}
        value={attributeName}
        onChange={(e) => setAttributeName(e.currentTarget.value)}
        withAsterisk
      />

      <Select
        placeholder={t('settingsPage.addNoteAttributeModal.elementTextfield')}
        label={t('settingsPage.addNoteAttributeModal.elementTextfield')}
        value={elementType}
        onChange={(e) => {
          if (e === null) return;
          setElementType(e as NoteAttributeElement);
        }}
        data={NoteAttributeElements}
        withAsterisk
        allowDeselect={false}
      />

      <Divider mt='md' mb='md' />

      <Text fs='italic' c='dimmed'>
        {t('settingsPage.addNoteAttributeModal.preview')}
      </Text>

      <Box bd='1px solid black'>{getPreviewElement()}</Box>

      <Button
        mt='md'
        onClick={() => {
          addAllNewAttributes();
          props.onClose();
        }}
        disabled={attributeName === '' || elementType === ''}
      >
        {t('settingsPage.addNoteAttributeModal.save')}
      </Button>
    </Modal>
  );
}

export default AddNoteAttributeModal;
