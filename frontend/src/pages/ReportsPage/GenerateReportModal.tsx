import {
  Modal,
  Stack,
  Group,
  Button,
  Textarea,
  Title,
  Divider,
  Select,
  Checkbox,
  ActionIcon,
  Center,
  Table,
  em,
  Box,
  TextInput,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../lib/axiosInstance';
import { ColorCodeConfiguration, NoteAttribute } from '../../Types';
import {
  AttributeVisualization,
  HealthReport,
  VisualizationType,
} from './Types';
import { IoAdd } from 'react-icons/io5';
import { TbEdit, TbFilter, TbX } from 'react-icons/tb';
import { useMediaQuery } from '@mantine/hooks';
import DiaryPageFilterModal from '../DiaryPage/DiaryPageFilterModal';
import ColorCodeModal from '../CalendarPage/ColorCodeModal';

interface Props {
  opened: boolean;
  onClose: () => void;
  onSave: (report: HealthReport) => void;
}

function GenerateReportModal(props: Props) {
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
  const { t } = useTranslation();
  const [locale, setLocale] = useState('en');

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

  const [reportName, setReportName] = useState<string>(
    `${t('reportsPage.addModal.healthReport')} - ` +
      new Date().toLocaleDateString(locale)
  );

  useEffect(() => {
    // Update the report name when the locale changes
    setReportName(
      `${t('reportsPage.addModal.healthReport')} - ` +
        new Date().toLocaleDateString(locale)
    );
  }, [locale]);

  const [folder, setFolder] = useState<string>('');

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const [startDate, setStartDate] = useState<Date>(oneMonthAgo);
  const [endDate, setEndDate] = useState<Date>(new Date());

  const [allAttributes, setAllAttributes] = useState<NoteAttribute[]>([]);
  const [allAttributeNames, setAllAttributeNames] = useState<string[]>([]);

  const [attributesVisualizations, setAttributesVisualizations] = useState<
    AttributeVisualization[]
  >([]);

  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [
    indexOfSelectedAttributeVisFilter,
    setIndexOfSelectedAttributeVisFilter,
  ] = useState<number | null>(null);

  const allVisualizationTypes: VisualizationType[] = [
    'sum',
    'min',
    'max',
    'average',
    'aggregate',
    'lineChart',
    'showAll',
    'showAllWithFilter',
  ];

  const [calendarViewFilter, setCalendarViewFilter] =
    useState<ColorCodeConfiguration>();

  const [colorCodeModalOpen, setColorCodeModalOpen] = useState(false);

  const [includeMedicationList, setIncludeMedicationList] = useState(false);

  const [additionalNotes, setAdditionalNotes] = useState('');

  useEffect(() => {
    axiosInstance.get<NoteAttribute[]>('NoteAttributes').then((response) => {
      setAllAttributes(response.data);
      setAllAttributeNames(response.data.map((attribute) => attribute.name));
    });
  }, []);

  function handleSave() {
    const report: HealthReport = {
      name: reportName,
      folder: folder,
      startDate: startDate,
      endDate: endDate,
      attributesVisualizations: attributesVisualizations,
      colorCodeConfig: calendarViewFilter,
      includeMedicationList: includeMedicationList,
      additionalNotes: additionalNotes,
    };

    props.onSave(report);
    props.onClose();
  }

  return (
    <Modal
      opened={props.opened}
      onClose={() => props.onClose()}
      title={t('reportsPage.addModal.title')}
      size='lg'
      fullScreen={isMobile}
    >
      <TextInput
        value={reportName}
        onChange={(e) => setReportName(e.target.value)}
        label={t('reportsPage.addModal.reportName')}
        withAsterisk
        mt={10}
        mb={10}
      />

      <TextInput
        value={folder}
        description={t('reportsPage.addModal.folderDesc')}
        onChange={(e) => setFolder(e.target.value)}
        label={t('reportsPage.addModal.folderLabel')}
        withAsterisk
        error={
          folder.endsWith('/') || folder.startsWith('/')
            ? t('reportsPage.addModal.folderErr')
            : null
        }
        mt={10}
        mb={10}
      />

      <Group grow>
        <DatePickerInput
          label={t('reportsPage.addModal.startDate')}
          withAsterisk
          value={startDate}
          locale={locale}
          onChange={(e) => {
            if (e) {
              setStartDate(e);
            }
          }}
        />

        <DatePickerInput
          label={t('reportsPage.addModal.endDate')}
          withAsterisk
          value={endDate}
          locale={locale}
          onChange={(e) => {
            if (e) {
              setEndDate(e);
            }
          }}
        />
      </Group>

      <Stack mt={20} gap='lg'>
        <div>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th></Table.Th>
                <Table.Th>{t('reportsPage.addModal.attribute')}</Table.Th>
                <Table.Th>{t('reportsPage.addModal.visualization')}</Table.Th>
                <Table.Th></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {attributesVisualizations.map((av, index) => (
                <Table.Tr key={index}>
                  <Table.Td>
                    <Center>
                      <ActionIcon
                        variant='subtle'
                        size='lg'
                        color='red'
                        onClick={() => {
                          setAttributesVisualizations((prev) =>
                            prev.filter((_, i) => i !== index)
                          );

                          setIndexOfSelectedAttributeVisFilter(null);
                        }}
                      >
                        <TbX size='1.5rem' />
                      </ActionIcon>
                    </Center>
                  </Table.Td>
                  <Table.Td>
                    <Select
                      data={allAttributeNames}
                      value={av.attributeName}
                      onChange={(e) => {
                        const updatedVisualizations = structuredClone(
                          attributesVisualizations
                        );
                        updatedVisualizations[index].attributeName = e ?? '';
                        setAttributesVisualizations(updatedVisualizations);
                      }}
                    />
                  </Table.Td>
                  <Table.Td>
                    <Select
                      disabled={av.attributeName === ''}
                      value={av.visualizationType}
                      data={allVisualizationTypes}
                      onChange={(e) => {
                        const updatedVisualizations = structuredClone(
                          attributesVisualizations
                        );
                        updatedVisualizations[index].visualizationType =
                          (e as VisualizationType) ?? '';
                        setAttributesVisualizations(updatedVisualizations);
                      }}
                    />
                  </Table.Td>
                  <Table.Td>
                    {av.visualizationType === 'showAllWithFilter' && (
                      <Center>
                        <ActionIcon
                          variant='subtle'
                          size='lg'
                          color='blue'
                          onClick={() => {
                            setFilterModalOpen(true);
                            setIndexOfSelectedAttributeVisFilter(index);
                          }}
                        >
                          <TbFilter size='1.5rem' />
                        </ActionIcon>
                      </Center>
                    )}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>

            <Table.Caption>
              <ActionIcon
                color='blue'
                size='xl'
                radius='xl'
                bd='2px solid black'
                onClick={() => {
                  setAttributesVisualizations((prev) => [
                    ...prev,
                    {
                      attributeName: '',
                      visualizationType: '',
                    },
                  ]);
                }}
              >
                <IoAdd size='2rem' />
              </ActionIcon>
            </Table.Caption>
          </Table>
        </div>

        <div>
          <Title order={4}>{t('reportsPage.addModal.calendarView')}</Title>
          <Divider />

          {calendarViewFilter && (
            <Center m={10}>
              <Button
                variant='light'
                leftSection={<TbEdit size='1.5rem' />}
                onClick={() => setColorCodeModalOpen(true)}
              >
                {t('reportsPage.addModal.colorCodeCalendar')}
              </Button>
            </Center>
          )}

          {calendarViewFilter === undefined && (
            <Center m={10}>
              <ActionIcon
                color='blue'
                size='xl'
                radius='xl'
                bd='2px solid black'
                onClick={() => {
                  setColorCodeModalOpen(true);
                }}
              >
                <IoAdd size='2rem' />
              </ActionIcon>
            </Center>
          )}
        </div>

        <Box mt={10}>
          <Checkbox
            label={t('reportsPage.addModal.includeMedicationList')}
            checked={includeMedicationList}
            onChange={(e) => setIncludeMedicationList(e.currentTarget.checked)}
          />
        </Box>

        <Textarea
          label={t('reportsPage.addModal.additionalNotes')}
          placeholder={t('reportsPage.addModal.notesPlaceholder')}
          autosize
          value={additionalNotes}
          onChange={(e) => setAdditionalNotes(e.currentTarget.value)}
          minRows={3}
        />
      </Stack>

      <Group mt={20}>
        <Button onClick={handleSave}>
          {t('reportsPage.addModal.previewReport')}
        </Button>

        <Button variant='outline' onClick={() => props.onClose()}>
          {t('reportsPage.addModal.cancel')}
        </Button>
      </Group>

      {indexOfSelectedAttributeVisFilter !== null && (
        <DiaryPageFilterModal
          opened={filterModalOpen} // This modal is not used in this context, but can be reused if needed
          onClose={() => {
            setFilterModalOpen(false);
          }}
          allAttributes={allAttributes}
          forcedElement={
            attributesVisualizations[indexOfSelectedAttributeVisFilter]
              .attributeName
          }
          diaryFilter={
            attributesVisualizations[indexOfSelectedAttributeVisFilter].filter
          }
          onSave={(filter) => {
            const updatedVisualizations = structuredClone(
              attributesVisualizations
            );
            updatedVisualizations[indexOfSelectedAttributeVisFilter].filter =
              filter;
            setAttributesVisualizations(updatedVisualizations);
            setFilterModalOpen(false);
          }}
          onReset={() => {
            const updatedVisualizations = structuredClone(
              attributesVisualizations
            );
            updatedVisualizations[indexOfSelectedAttributeVisFilter].filter = {
              logicGate: 'AND',
              clauses: [
                {
                  element: '',
                  operator: '',
                  value: '',
                },
              ],
            };
            setAttributesVisualizations(updatedVisualizations);
            setFilterModalOpen(false);
          }}
        />
      )}

      <ColorCodeModal
        opened={colorCodeModalOpen}
        onClose={() => setColorCodeModalOpen(false)}
        onSave={(colorCodeConfig) => setCalendarViewFilter(colorCodeConfig)}
        onReset={() => setCalendarViewFilter(undefined)}
        allAttributes={allAttributes}
      />
    </Modal>
  );
}

export default GenerateReportModal;
