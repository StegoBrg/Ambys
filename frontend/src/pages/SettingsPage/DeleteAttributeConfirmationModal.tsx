import { Alert, Button, Group, Modal, Text } from '@mantine/core';
import { NoteAttribute } from '../../Types';
import { TbExclamationCircle } from 'react-icons/tb';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../lib/axiosInstance';

interface Props {
  opened: boolean;
  onClose: () => void;
  onDelete: () => void;
  attribute: NoteAttribute | null;
}

function DeleteAttributeConfirmationModal(props: Props) {
  const { t } = useTranslation();

  const [counter, setCounter] = useState(20);
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    if (counter > 0) {
      const timer = setInterval(() => {
        setCounter((prev) => prev - 1);
      }, 1000);

      // Cleanup the interval on component unmount
      return () => clearInterval(timer);
    } else {
      // Enable the button when the countdown reaches 0
      setIsDisabled(false);
    }
  }, [counter]);

  // Reset the counter and disable the button every time the modal is opened.
  useEffect(() => {
    setCounter(20);
    setIsDisabled(true);
  }, [props.opened]);

  function deleteAttribute(attributeId: number) {
    axiosInstance
      .delete('NoteAttributes/' + attributeId)
      .then(() => {
        props.onDelete();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  return (
    <Modal
      opened={props.opened}
      onClose={props.onClose}
      title={t('settingsPage.noteAttributes.deletionDialogTitle')}
      centered
    >
      <Alert
        color='red'
        variant='filled'
        title={t('settingsPage.noteAttributes.deletionAlertTitle')}
        icon={<TbExclamationCircle />}
      >
        <Text fw='bold'>
          {t('settingsPage.noteAttributes.deletionAlertText', {
            attributeName: props.attribute?.name,
          })}
        </Text>
      </Alert>

      <Group justify='flex-end' mt='lg'>
        <Button
          mr='auto'
          color='red'
          disabled={isDisabled}
          onClick={() => {
            if (props.attribute?.id !== undefined) {
              deleteAttribute(props.attribute.id);
            }
            props.onClose();
          }}
        >
          {isDisabled
            ? t('settingsPage.noteAttributes.deletionButtonCounter') + counter
            : t('settingsPage.noteAttributes.deletionButtonFinal')}
        </Button>
        <Button onClick={() => props.onClose()}>
          {t('settingsPage.noteAttributes.Cancel')}
        </Button>
      </Group>
    </Modal>
  );
}

export default DeleteAttributeConfirmationModal;
