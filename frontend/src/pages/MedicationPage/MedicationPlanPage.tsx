import { ActionIcon, Accordion, Group } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { IoAdd } from 'react-icons/io5';
import { TbCancel, TbNotes, TbTrash } from 'react-icons/tb';
import { useContextMenu } from 'mantine-contextmenu';
import { useState, useEffect } from 'react';
import axiosInstance from '../../lib/axiosInstance';
import { Medication, MedicationPlanEntry } from '../../Types';
import { useTranslation } from 'react-i18next';
import AddMedicationPlanEntryModal from './AddMedicationPlanEntryModal';
import CancelMedicationPlanEntryModal from './CancelMedicationPlanEntryModal';
import EditMedicationPlanEntryModal from './EditMedicationPlanEntryModal';
import DeleteMedicationPlanEntryModal from './DeleteMedicationPlanEntryModal';

function MedicationPlanPage() {
  const { showContextMenu } = useContextMenu();
  const { t } = useTranslation();

  const [locale, setLocale] = useState('en');

  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Update locale if string is loaded from i18next.
  useEffect(() => {
    const checkLocaleLoaded = () => {
      const loadedLocale = t('diaryPage.diaryEntry.dates.dayjsLocale');
      if (loadedLocale !== 'diaryPage.diaryEntry.dates.dayjsLocale') {
        setLocale(loadedLocale);
      } else {
        setLocale('en');
      }
    };

    checkLocaleLoaded();
  }, [t]);

  const [medications, setMedications] = useState<Medication[]>([]);

  const [currentPlanEntries, setCurrentPlanEntries] = useState<
    MedicationPlanEntry[]
  >([]);
  const [historyPlanEntries, setHistoryPlanEntries] = useState<
    MedicationPlanEntry[]
  >([]);

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [medicationPlanEntryToCancel, setMedicationPlanEntryToCancel] =
    useState<MedicationPlanEntry | null>(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [medicationPlanEntryToEdit, setMedicationPlanEntryToEdit] =
    useState<MedicationPlanEntry | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [medicationPlanEntryToDelete, setMedicationPlanEntryToDelete] =
    useState<MedicationPlanEntry | null>(null);

  const lowerFirstChar = (str: string) =>
    str.charAt(0).toLowerCase() + str.slice(1);

  function loadData() {
    axiosInstance.get('/medications').then((response) => {
      setMedications(response.data);
    });

    axiosInstance.get('/MedicationPlanEntries').then((response) => {
      const currentPlanEntries: MedicationPlanEntry[] = response.data.filter(
        (entry: MedicationPlanEntry) => entry.isActive
      );

      const pastPlanEntries: MedicationPlanEntry[] = response.data.filter(
        (entry: MedicationPlanEntry) => !entry.isActive
      );

      setCurrentPlanEntries(currentPlanEntries.sort((a, b) => a.id - b.id));
      setHistoryPlanEntries(pastPlanEntries.sort((a, b) => a.id - b.id));
    });
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <Accordion variant='separated' defaultValue='current'>
        <Accordion.Item value='current'>
          <Accordion.Control>
            {t('medicationsPage.medicationPlan.accordionCurrent')}
          </Accordion.Control>
          <Accordion.Panel>
            <DataTable
              withTableBorder
              borderRadius='sm'
              withColumnBorders
              striped
              highlightOnHover
              onRowContextMenu={({ record, event }) =>
                showContextMenu([
                  {
                    key: 'delete-plan-entry',
                    title: t(
                      'medicationsPage.medicationPlan.deleteModal.contextMenuTitle'
                    ),
                    icon: <TbTrash size={16} />,
                    color: 'red',
                    onClick: () => {
                      setDeleteModalOpen(true);
                      setMedicationPlanEntryToDelete(record);
                    },
                  },
                ])(event)
              }
              minHeight={medications.length > 0 ? 0 : 150} // Set minHeight to 150 if there are no records to show the no records icon.
              records={currentPlanEntries}
              columns={[
                {
                  accessor: 'id',
                  title: '#',
                  textAlign: 'right',
                },
                {
                  accessor: 'startDate',
                  title: t('medicationsPage.medicationPlan.startDate'),
                  render: (value) => {
                    return new Date(value.startDate).toLocaleDateString(locale);
                  },
                },
                {
                  accessor: 'endDate',
                  title: t('medicationsPage.medicationPlan.endDate'),
                  render: (value) => {
                    if (value.endDate) {
                      return new Date(value.endDate).toLocaleDateString(locale);
                    }
                  },
                },
                {
                  accessor: 'medication.name',
                  title: t('medicationsPage.medicationPlan.medication'),
                  render: (value) => {
                    return `${value.medication.name} (${value.medication.strength})`;
                  },
                },
                {
                  accessor: 'dosage',
                  title: t('medicationsPage.medicationPlan.dosage'),
                },
                {
                  accessor: 'schedule.type',
                  title: t('medicationsPage.medicationPlan.type'),
                  render: (value) => {
                    if (value.schedule?.type) {
                      return t(
                        `medicationsPage.medicationPlan.addModal.types.${lowerFirstChar(
                          value.schedule.type
                        )}`
                      );
                    }
                  },
                },
                {
                  accessor: 'schedule.timesOfDay',
                  title: t('medicationsPage.medicationPlan.timesOfDay'),
                  render: (value) => {
                    if (value.schedule) {
                      const timesOfDayFormatted = [];

                      for (
                        let i = 0;
                        i < value.schedule.timesOfDay.length;
                        i++
                      ) {
                        const timeString = value.schedule.timesOfDay[i];
                        const [hours, minutes] = timeString.split(':');
                        timesOfDayFormatted.push(`${hours}:${minutes}`);
                      }

                      return timesOfDayFormatted.join(', ');
                    }

                    return;
                  },
                },
                {
                  accessor: 'schedule.daysOfWeek',
                  title: t('medicationsPage.medicationPlan.daysOfWeek'),
                  render: (value) => {
                    if (value.schedule) {
                      if (value.schedule.daysOfWeek) {
                        const localizedDaysOfWeek: string[] = [];
                        value.schedule.daysOfWeek.forEach((day) => {
                          localizedDaysOfWeek.push(
                            t(`days.${day.toLowerCase()}`)
                          );
                        });
                        return localizedDaysOfWeek.join(', ');
                      }
                    }
                    return;
                  },
                },
                {
                  accessor: 'schedule.intervalDays',
                  title: t('medicationsPage.medicationPlan.everyXDays'),
                },
                {
                  accessor: 'schedule.intervalWeeks',
                  title: t('medicationsPage.medicationPlan.everyXWeeks'),
                },
                {
                  accessor: 'notes',
                  title: t('medicationsPage.medicationPlan.notes'),
                  width: 200,
                },
                {
                  accessor: 'actions',
                  title: '',
                  textAlign: 'right',
                  width: '0%',
                  render: (entry) => (
                    <Group gap='sm' wrap='nowrap'>
                      <ActionIcon
                        variant='subtle'
                        color='green'
                        onClick={() => {
                          setEditModalOpen(true);
                          setMedicationPlanEntryToEdit(entry);
                        }}
                      >
                        <TbNotes size={20} />
                      </ActionIcon>
                      <ActionIcon
                        variant='subtle'
                        color='red'
                        onClick={() => {
                          setCancelModalOpen(true);
                          setMedicationPlanEntryToCancel(entry);
                        }}
                      >
                        <TbCancel size={20} />
                      </ActionIcon>
                    </Group>
                  ),
                },
              ]}
              pinLastColumn
            />
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value='past'>
          <Accordion.Control>
            {t('medicationsPage.medicationPlan.accordionPast')}
          </Accordion.Control>
          <Accordion.Panel>
            <DataTable
              withTableBorder
              borderRadius='sm'
              withColumnBorders
              striped
              highlightOnHover
              onRowContextMenu={({ record, event }) =>
                showContextMenu([
                  {
                    key: 'delete-plan-entry',
                    title: t(
                      'medicationsPage.medicationPlan.deleteModal.contextMenuTitle'
                    ),
                    icon: <TbTrash size={16} />,
                    color: 'red',
                    onClick: () => {
                      setDeleteModalOpen(true);
                      setMedicationPlanEntryToDelete(record);
                    },
                  },
                ])(event)
              }
              minHeight={medications.length > 0 ? 0 : 150} // Set minHeight to 150 if there are no records to show the no records icon.
              records={historyPlanEntries}
              columns={[
                {
                  accessor: 'id',
                  title: '#',
                  textAlign: 'right',
                },
                {
                  accessor: 'startDate',
                  title: t('medicationsPage.medicationPlan.startDate'),
                  render: (value) => {
                    return new Date(value.startDate).toLocaleDateString(locale);
                  },
                },
                {
                  accessor: 'endDate',
                  title: t('medicationsPage.medicationPlan.endDate'),
                  render: (value) => {
                    if (value.endDate) {
                      return new Date(value.endDate).toLocaleDateString(locale);
                    }
                  },
                },
                {
                  accessor: 'medication.name',
                  title: t('medicationsPage.medicationPlan.medication'),
                  render: (value) => {
                    return `${value.medication.name} (${value.medication.strength})`;
                  },
                },
                {
                  accessor: 'dosage',
                  title: t('medicationsPage.medicationPlan.dosage'),
                },
                {
                  accessor: 'schedule.type',
                  title: t('medicationsPage.medicationPlan.type'),
                  render: (value) => {
                    if (value.schedule?.type) {
                      return t(
                        `medicationsPage.medicationPlan.addModal.types.${lowerFirstChar(
                          value.schedule.type
                        )}`
                      );
                    }
                  },
                },
                {
                  accessor: 'schedule.timesOfDay',
                  title: t('medicationsPage.medicationPlan.timesOfDay'),
                  render: (value) => {
                    if (value.schedule) {
                      const timesOfDayFormatted = [];

                      for (
                        let i = 0;
                        i < value.schedule.timesOfDay.length;
                        i++
                      ) {
                        const timeString = value.schedule.timesOfDay[i];
                        const [hours, minutes] = timeString.split(':');
                        timesOfDayFormatted.push(`${hours}:${minutes}`);
                      }

                      return timesOfDayFormatted.join(', ');
                    }

                    return;
                  },
                },
                {
                  accessor: 'schedule.daysOfWeek',
                  title: t('medicationsPage.medicationPlan.daysOfWeek'),
                  render: (value) => {
                    if (value.schedule) {
                      if (value.schedule.daysOfWeek) {
                        const localizedDaysOfWeek: string[] = [];
                        value.schedule.daysOfWeek.forEach((day) => {
                          localizedDaysOfWeek.push(
                            t(`days.${day.toLowerCase()}`)
                          );
                        });
                        return localizedDaysOfWeek.join(', ');
                      }
                    }
                    return;
                  },
                },
                {
                  accessor: 'schedule.intervalDays',
                  title: t('medicationsPage.medicationPlan.everyXDays'),
                },
                {
                  accessor: 'schedule.intervalWeeks',
                  title: t('medicationsPage.medicationPlan.everyXWeeks'),
                },
                {
                  accessor: 'notes',
                  title: t('medicationsPage.medicationPlan.notes'),
                },
                {
                  accessor: 'stoppedReason',
                  title: t('medicationsPage.medicationPlan.stoppedReason'),
                },
              ]}
            />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

      <ActionIcon
        aria-label='Create'
        color='blue'
        size='3.5rem'
        radius='xl'
        onClick={() => setDetailModalOpen(true)}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          outline: '2px solid black',
        }}
      >
        <IoAdd size='2rem' />
      </ActionIcon>

      <AddMedicationPlanEntryModal
        opened={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        onSave={() => {
          loadData();
          setDetailModalOpen(false);
        }}
        medicationList={medications}
      />

      {medicationPlanEntryToCancel && (
        <CancelMedicationPlanEntryModal
          opened={cancelModalOpen}
          onClose={() => {
            setCancelModalOpen(false);
            setMedicationPlanEntryToCancel(null);
          }}
          onSave={() => {
            loadData();
            setCancelModalOpen(false);
            setMedicationPlanEntryToCancel(null);
          }}
          medicationPlanEntryToCancel={medicationPlanEntryToCancel}
        />
      )}

      {medicationPlanEntryToEdit && (
        <EditMedicationPlanEntryModal
          opened={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setMedicationPlanEntryToEdit(null);
          }}
          onSave={() => {
            loadData();
            setEditModalOpen(false);
            setMedicationPlanEntryToEdit(null);
          }}
          medicationPlanEntryToEdit={medicationPlanEntryToEdit}
        />
      )}

      {medicationPlanEntryToDelete && (
        <DeleteMedicationPlanEntryModal
          opened={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setMedicationPlanEntryToDelete(null);
          }}
          onSave={() => {
            loadData();
            setDeleteModalOpen(false);
            setMedicationPlanEntryToDelete(null);
          }}
          medicationPlanEntryToDelete={medicationPlanEntryToDelete}
        />
      )}
    </>
  );
}

export default MedicationPlanPage;
