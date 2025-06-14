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
  Alert,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../lib/axiosInstance';
import { NoteAttribute } from '../../Types';
import { AttributeVisualization, VisualizationType } from './ReportViewer';
import { IoAdd } from 'react-icons/io5';
import { TbFilter, TbX } from 'react-icons/tb';
import { useMediaQuery } from '@mantine/hooks';
import DiaryPageFilterModal from '../DiaryPage/DiaryPageFilterModal';

interface Props {
  opened: boolean;
  onClose: () => void;
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

  useEffect(() => {
    axiosInstance.get<NoteAttribute[]>('NoteAttributes').then((response) => {
      setAllAttributes(response.data);
      setAllAttributeNames(response.data.map((attribute) => attribute.name));
    });
  }, []);

  console.log(attributesVisualizations);

  return (
    <Modal
      opened={props.opened}
      onClose={() => props.onClose()}
      title='Generate Report'
      size='lg'
      fullScreen={isMobile}
    >
      <Alert color='red' variant='light'>
        List all errors here that make the report generation impossible, e.g
        missing filters or incompatible visualizationtypes
      </Alert>
      <Group grow>
        <DatePickerInput
          label='Start Date'
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
          label='End Date'
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
          <Title order={4}>Attributes</Title>
          <Divider />

          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th></Table.Th>
                <Table.Th>Attribute</Table.Th>
                <Table.Th>Visualization</Table.Th>
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
          <Title order={4}>Calendar View</Title>
          <Divider />
          {/* Reuse color coded calendar view here */}
        </div>

        <div>
          <Title order={4}>Pages</Title>
          <Divider />
          {/* Print specific notebook pages in the report */}
        </div>

        <div>
          <Title order={4}>Medication</Title>
          <Divider />
          <Checkbox label={'Include Medication List'} checked={true} readOnly />
        </div>

        <Textarea
          label='Additional Notes'
          placeholder='Enter any additional notes for the report...'
          autosize
          minRows={3}
        />
      </Stack>

      <Group mt={20}>
        <Button onClick={() => {}}>Generate Report</Button>

        <Button variant='outline' onClick={() => props.onClose()}>
          Cancel
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
            console.log('Saving filter:', filter);
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
    </Modal>
  );
}

export default GenerateReportModal;
