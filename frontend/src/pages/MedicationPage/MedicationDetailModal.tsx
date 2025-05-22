import { Button, Group, Modal, Stack, TextInput } from '@mantine/core';
import { useEffect, useState } from 'react';
import axiosInstance from '../../lib/axiosInstance';
import { Medication } from '../../Types';
import { useTranslation } from 'react-i18next';

interface Props {
  opened: boolean;
  onClose: () => void;
  onSave: () => void;

  selectedMedication: Medication | null; // If set, the modal is in edit mode, otherwise in add mode.
}

function MedicationDetailModal(props: Props) {
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [strength, setStrength] = useState('');
  const [type, setType] = useState('');

  function addMedication() {
    axiosInstance
      .post('medications', {
        name: name,
        description: description,
        strength: strength,
        type: type,
      })
      .then(() => {
        props.onSave();
      });
  }

  function editMedication() {
    if (props.selectedMedication) {
      axiosInstance
        .put(`medications/${props.selectedMedication.id}`, {
          name: name,
          description: description,
          strength: strength,
          type: type,
        })
        .then(() => {
          props.onSave();
        });
    }
  }

  useEffect(() => {
    if (props.selectedMedication) {
      setName(props.selectedMedication.name);
      setDescription(props.selectedMedication.description);
      setStrength(props.selectedMedication.strength);
      setType(props.selectedMedication.type);
    } else {
      // Reset values when the modal is closed.
      setName('');
      setDescription('');
      setStrength('');
      setType('');
    }
  }, [props.selectedMedication]);

  return (
    <Modal
      opened={props.opened}
      onClose={() => props.onClose()}
      title={
        props.selectedMedication
          ? t('medicationsPage.medicationList.detailModal.editTitle')
          : t('medicationsPage.medicationList.detailModal.addTitle')
      }
    >
      <Stack>
        <TextInput
          label={t('medicationsPage.medicationList.detailModal.nameLabel')}
          placeholder={t(
            'medicationsPage.medicationList.detailModal.namePlaceholder'
          )}
          withAsterisk
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextInput
          label={t('medicationsPage.medicationList.detailModal.descLabel')}
          placeholder={t(
            'medicationsPage.medicationList.detailModal.descPlaceholder'
          )}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextInput
          label={t('medicationsPage.medicationList.detailModal.strengthLabel')}
          description={t(
            'medicationsPage.medicationList.detailModal.strengthDesc'
          )}
          placeholder={t(
            'medicationsPage.medicationList.detailModal.strengthPlaceholder'
          )}
          withAsterisk
          value={strength}
          onChange={(e) => setStrength(e.target.value)}
        />
        <TextInput
          label={t('medicationsPage.medicationList.detailModal.typeLabel')}
          placeholder={t(
            'medicationsPage.medicationList.detailModal.typePlaceholder'
          )}
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
      </Stack>

      <Group mt={20}>
        {!props.selectedMedication && (
          <Button onClick={addMedication}>
            {t('medicationsPage.medicationList.detailModal.addButton')}
          </Button>
        )}
        {props.selectedMedication && (
          <Button onClick={editMedication}>
            {t('medicationsPage.medicationList.detailModal.editButton')}
          </Button>
        )}
        <Button variant='outline' onClick={() => props.onClose()}>
          {t('medicationsPage.medicationList.detailModal.cancelButton')}
        </Button>
      </Group>
    </Modal>
  );
}

export default MedicationDetailModal;
