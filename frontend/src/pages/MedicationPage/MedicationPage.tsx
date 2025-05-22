import { useEffect, useState } from 'react';
import axiosInstance from '../../lib/axiosInstance';
import { DataTable } from 'mantine-datatable';
import { Medication } from '../../Types';
import { ActionIcon, Center } from '@mantine/core';
import { IoAdd } from 'react-icons/io5';
import MedicationDetailModal from './MedicationDetailModal';
import { useContextMenu } from 'mantine-contextmenu';
import { TbTrash } from 'react-icons/tb';
import DeleteMedicationModel from './DeleteMedicationModal';
import { useTranslation } from 'react-i18next';

function MedicationPage() {
  const { t } = useTranslation();
  const { showContextMenu } = useContextMenu();

  const [medications, setMedications] = useState<Medication[]>([]);

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedMedication, setSelectedMedication] =
    useState<Medication | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [medicationToDelete, setMedicationToDelete] =
    useState<Medication | null>(null);

  function loadData() {
    axiosInstance.get('/medications').then((response) => {
      setMedications(response.data);
    });
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <Center>
        <DataTable
          w={'80vw'}
          withTableBorder
          borderRadius='sm'
          withColumnBorders
          striped
          highlightOnHover
          onRowContextMenu={({ record, event }) =>
            showContextMenu([
              {
                key: 'delete-medication',
                title: t(
                  'medicationsPage.medicationList.deleteModal.contextMenuTitle'
                ),
                icon: <TbTrash size={16} />,
                color: 'red',
                onClick: () => {
                  setMedicationToDelete(record);
                  setDeleteModalOpen(true);
                },
              },
            ])(event)
          }
          minHeight={medications.length > 0 ? 0 : 150} // Set minHeight to 150 if there are no records to show the no records icon.
          records={medications}
          columns={[
            {
              accessor: 'id',
              title: '#',
              textAlign: 'right',
            },
            {
              accessor: 'name',
              title: t('medicationsPage.medicationList.name'),
            },
            {
              accessor: 'description',
              title: t('medicationsPage.medicationList.desc'),
            },
            {
              accessor: 'strength',
              title: t('medicationsPage.medicationList.strength'),
            },
            {
              accessor: 'type',
              title: t('medicationsPage.medicationList.type'),
            },
          ]}
          onRowClick={({ record: Medication }) => {
            setSelectedMedication(Medication);
            setDetailModalOpen(true);
          }}
        />
        <ActionIcon
          aria-label='Create'
          color='blue'
          size='3.5rem'
          radius='xl'
          onClick={() => {
            setDetailModalOpen(true);
            setSelectedMedication(null);
          }}
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            outline: '2px solid black',
          }}
        >
          <IoAdd size='2rem' />
        </ActionIcon>

        <MedicationDetailModal
          opened={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          selectedMedication={selectedMedication}
          onSave={() => {
            loadData();
            setDetailModalOpen(false);
            setSelectedMedication(null);
          }}
        />

        {medicationToDelete && (
          <DeleteMedicationModel
            opened={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            medicationToDelete={medicationToDelete}
            onDelete={() => {
              loadData();
              setDeleteModalOpen(false);
              setMedicationToDelete(null);
            }}
          />
        )}
      </Center>
    </>
  );
}

export default MedicationPage;
