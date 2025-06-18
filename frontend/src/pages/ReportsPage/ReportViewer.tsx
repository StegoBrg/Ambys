import { useEffect, useState } from 'react';
import {
  DailyNote,
  DiaryFilterConfiguration,
  MedicationPlanEntry,
} from '../../Types';
import axiosInstance from '../../lib/axiosInstance';
import {
  ActionIcon,
  Box,
  Divider,
  em,
  Flex,
  Grid,
  Group,
  Paper,
  Space,
  Title,
} from '@mantine/core';
import { LineChart } from '@mantine/charts';
import {
  getAttributeAggregate,
  getAttributeAverage,
  getAttributeMax,
  getAttributeMin,
  getAttributeShowAll,
  getAttributeShowAllWithFilter,
  getAttributeSum,
} from './VisualizationFunctions';
import { HealthReport, HealthReportStringDates } from './Types';
import { Calendar } from '@mantine/dates';
import { getColorCodingForDate } from '../CalendarPage/lib';
import { getFirstDaysOfMonths } from './CalendarFunctions';
import ColorLegend from './ColorLegend';
import { DataTable } from 'mantine-datatable';
import { useTranslation } from 'react-i18next';
import {
  TbArrowLeft,
  TbDeviceFloppy,
  TbEdit,
  TbFileExport,
  TbTrash,
} from 'react-icons/tb';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { useMediaQuery } from '@mantine/hooks';
import ReportHeader from './ReportHeader';

interface Props {
  healthReport: HealthReport;
  preview: boolean; // If true, delete and export button will be replaced by save button

  onBack: () => void;
  onEditPreview: () => void;
}

function ReportViewer(props: Props) {
  const { t } = useTranslation();
  const [locale, setLocale] = useState('en');
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

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
  const [startDate] = useState<Date>(props.healthReport.startDate);
  const [endDate] = useState<Date>(props.healthReport.endDate);

  const [dailyNotes, setDailyNotes] = useState<DailyNote[]>([]);

  const [medicationPlanEntries, setMedicationPlanEntries] = useState<
    MedicationPlanEntry[]
  >([]);

  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] =
    useState(false);

  useEffect(() => {
    axiosInstance
      .get<DailyNote[]>(
        `dailynotes?startDate=${
          startDate.toISOString().split('T')[0]
        }&endDate=${endDate.toISOString().split('T')[0]}`
      )
      .then((response) => {
        setDailyNotes(response.data);
      });
  }, [endDate, startDate]);

  const lowerFirstChar = (str: string) =>
    str.charAt(0).toLowerCase() + str.slice(1);

  useEffect(() => {
    if (props.healthReport.includeMedicationList) {
      axiosInstance.get('/MedicationPlanEntries').then((response) => {
        const planEntries: MedicationPlanEntry[] = response.data.filter(
          (entry: MedicationPlanEntry) => {
            const entryDate = new Date(entry.startDate);
            return entryDate >= startDate && entryDate <= endDate;
          }
        );

        setMedicationPlanEntries(planEntries);
      });
    }
  }, [endDate, props.healthReport.includeMedicationList, startDate]);

  return (
    <>
      <Grid m={5}>
        <Grid.Col span='content'>
          <ActionIcon
            variant='transparent'
            size='lg'
            ml={5}
            onClick={props.onBack}
          >
            <TbArrowLeft size={24} />
          </ActionIcon>
        </Grid.Col>

        <Grid.Col span='auto'></Grid.Col>

        <Grid.Col span='content'>
          {!props.preview && (
            <>
              <ActionIcon
                variant='transparent'
                color='green'
                mr={10}
                onClick={() => {
                  console.log('EXPORT');
                }}
              >
                <TbFileExport size='2rem' />
              </ActionIcon>
              <ActionIcon
                variant='transparent'
                color='red'
                mr={5}
                onClick={() => setDeleteConfirmationModalOpen(true)}
              >
                <TbTrash size='2rem' />
              </ActionIcon>
            </>
          )}

          {props.preview && (
            <Group gap='md'>
              <ActionIcon
                variant='transparent'
                color='blue'
                mr={10}
                onClick={props.onEditPreview}
              >
                <TbEdit size='2rem' />
              </ActionIcon>

              <ActionIcon
                variant='transparent'
                color='green'
                mr={10}
                onClick={() => {
                  const healthReportStringDates: HealthReportStringDates = {
                    id: props.healthReport.id,
                    name: props.healthReport.name,
                    startDate: props.healthReport.startDate
                      .toISOString()
                      .split('T')[0],
                    endDate: props.healthReport.endDate
                      .toISOString()
                      .split('T')[0],
                    attributesVisualizations:
                      props.healthReport.attributesVisualizations,
                    colorCodeConfig: props.healthReport.colorCodeConfig,
                    includeMedicationList:
                      props.healthReport.includeMedicationList,
                    additionalNotes: props.healthReport.additionalNotes,
                  };

                  axiosInstance
                    .post<HealthReport[]>(
                      'HealthReportConfigs',
                      healthReportStringDates
                    )
                    .then(() => {
                      props.onBack();
                    });
                }}
              >
                <TbDeviceFloppy size='2rem' />
              </ActionIcon>
            </Group>
          )}
        </Grid.Col>
      </Grid>
      <Divider />

      <Space h='md' />

      <ReportHeader
        name={props.healthReport.name}
        dailyNoteCount={dailyNotes.length}
        startDate={props.healthReport.startDate.toLocaleDateString(locale)}
        endDate={props.healthReport.endDate.toLocaleDateString(locale)}
      />

      {props.healthReport.attributesVisualizations.map((av, index) => {
        switch (av.visualizationType) {
          case 'sum': {
            const sum = getAttributeSum(av.attributeName, dailyNotes);
            return (
              <Box key={index}>
                <h2>{av.attributeName} - Sum</h2>
                <p>{sum}</p>
              </Box>
            );
          }
          case 'min': {
            const min = getAttributeMin(av.attributeName, dailyNotes);

            if (!min) {
              return (
                <Box key={index}>
                  <h2>{av.attributeName} - Min</h2>
                  <p>No valid values found</p>
                </Box>
              );
            }
            return (
              <Box key={index}>
                <h2>{av.attributeName} - Min</h2>
                <p>
                  {min.date.toDateString()} - {min.value}
                </p>
              </Box>
            );
          }
          case 'max': {
            const max = getAttributeMax(av.attributeName, dailyNotes);

            if (!max) {
              return (
                <Box key={index}>
                  <h2>{av.attributeName} - Max</h2>
                  <p>No valid values found</p>
                </Box>
              );
            }
            return (
              <Box key={index}>
                <h2>{av.attributeName} - Max</h2>
                <p>
                  {max.date.toDateString()} - {max.value}
                </p>
              </Box>
            );
          }
          case 'average': {
            const average = getAttributeAverage(av.attributeName, dailyNotes);

            if (!average) {
              return (
                <Box key={index}>
                  <h2>{av.attributeName} - Average</h2>
                  <p>No valid values found</p>
                </Box>
              );
            }
            return (
              <Box key={index}>
                <h2>{av.attributeName} - Average</h2>
                <p>{average}</p>
              </Box>
            );
          }
          case 'aggregate': {
            const aggregate = getAttributeAggregate(
              av.attributeName,
              dailyNotes
            );

            if (!aggregate) {
              return (
                <Box key={index}>
                  <h2>{av.attributeName} - Aggregate</h2>
                  <p>No valid values found</p>
                </Box>
              );
            }
            return (
              <Box key={index}>
                <h2>{av.attributeName} - Aggregate</h2>
                {aggregate.map((item, idx) => (
                  <p key={idx}>
                    {item.value} - {item.count}
                  </p>
                ))}
              </Box>
            );
          }
          case 'lineChart': {
            // Get all notes with the specified attribute
            const allAttributes = getAttributeShowAll(
              av.attributeName,
              dailyNotes
            );

            // Convert the data to the format required by LineChart
            const allAttributesStringDates = allAttributes.map((item) => {
              return {
                date: item.date.toISOString().split('T')[0], // Convert to string date format
                value: item.value,
              };
            });

            return (
              <Box key={index}>
                <h2>{av.attributeName} - Line Chart</h2>
                <LineChart
                  h={300}
                  data={allAttributesStringDates}
                  dataKey='date'
                  series={[{ name: 'value', color: 'indigo.6' }]}
                  curveType='linear'
                />
              </Box>
            );
          }
          case 'showAll': {
            const allAttributes = getAttributeShowAll(
              av.attributeName,
              dailyNotes
            );

            if (!allAttributes) {
              return (
                <Box key={index}>
                  <h2>{av.attributeName} - Show All</h2>
                  <p>No valid values found</p>
                </Box>
              );
            }
            return (
              <Box key={index}>
                <h2>{av.attributeName} - Show All</h2>
                {allAttributes.map((item, idx) => (
                  <p key={idx}>
                    {item.date.toDateString()} - {item.value}
                  </p>
                ))}
              </Box>
            );
          }
          case 'showAllWithFilter': {
            const allAttributesWithFilter = getAttributeShowAllWithFilter(
              av.attributeName,
              dailyNotes,
              av.filter as DiaryFilterConfiguration
            );

            if (!allAttributesWithFilter) {
              return (
                <Box key={index}>
                  <h2>{av.attributeName} - Show All with Filter</h2>
                  <p>No valid values found</p>
                </Box>
              );
            }
            return (
              <Box key={index}>
                <h2>{av.attributeName} - Show All with Filter</h2>
                <p>
                  <strong>Filter:</strong>{' '}
                  {av.filter
                    ? av.filter.clauses
                        .map(
                          (clause) =>
                            `${clause.element} ${clause.operator} ${clause.value}`
                        )
                        .join(` ${av.filter.logicGate} `)
                    : 'None'}
                </p>
                {allAttributesWithFilter.map((item, idx) => (
                  <p key={idx}>
                    {item.date.toDateString()} - {item.value}
                  </p>
                ))}
              </Box>
            );
          }
          default: {
            console.error('Unknown visualization type:', av.visualizationType);
            return <></>;
          }
        }
      })}

      {props.healthReport.colorCodeConfig &&
        props.healthReport.colorCodeConfig.length > 0 && (
          <>
            <ColorLegend filters={props.healthReport.colorCodeConfig} />
            <Flex mt='md' gap='md' direction={isMobile ? 'column' : 'row'}>
              {getFirstDaysOfMonths(startDate, endDate).map((date, index) => (
                <Paper withBorder key={index}>
                  <Calendar
                    size='lg'
                    date={date}
                    highlightToday={true}
                    static
                    weekendDays={[]} // Removes weekend highlight which may conflict with color coding.
                    renderDay={(date) => {
                      const day = date.getDate();

                      return (
                        <Box
                          fz='1.2rem'
                          fw='bolder'
                          c={getColorCodingForDate(
                            date,
                            props.healthReport.colorCodeConfig,
                            dailyNotes
                          )}
                        >
                          {day}
                        </Box>
                      );
                    }}
                  />
                </Paper>
              ))}
            </Flex>
          </>
        )}

      {props.healthReport.includeMedicationList && (
        <DataTable
          mt={20}
          withTableBorder
          borderRadius='sm'
          withColumnBorders
          striped
          minHeight={medicationPlanEntries.length > 0 ? 0 : 150} // Set minHeight to 150 if there are no records to show the no records icon.
          records={medicationPlanEntries}
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

                  for (let i = 0; i < value.schedule.timesOfDay.length; i++) {
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
                      localizedDaysOfWeek.push(t(`days.${day.toLowerCase()}`));
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
              accessor: 'stoppedReason',
              title: t('medicationsPage.medicationPlan.stoppedReason'),
            },
          ]}
        />
      )}

      {props.healthReport.additionalNotes && (
        <>
          <Title order={3} mt='md'>
            Additional Notes
          </Title>
          <Paper mt='md'>{props.healthReport.additionalNotes}</Paper>
        </>
      )}

      <DeleteConfirmationModal
        opened={deleteConfirmationModalOpen}
        onClose={() => setDeleteConfirmationModalOpen(false)}
        elementToDelete={props.healthReport}
        onDelete={() => props.onBack()}
      />
    </>
  );
}

export default ReportViewer;
