// This page will display a the last diary entries with an option to show more. There should be a button to add a diary entry.
// On the main page there will be a form to add a new diary entry directly.

import { useCallback, useEffect, useState } from 'react';
import DiaryEntry from '../Shared/DiaryEntry';
import { IoAdd } from 'react-icons/io5';
import {
  DailyNote,
  DiaryFilterConfiguration,
  NoteAttribute,
  NoteConfiguration,
} from '../../Types';
import { useTranslation } from 'react-i18next';
import {
  ActionIcon,
  Center,
  Grid,
  Group,
  Loader,
  Paper,
  SegmentedControl,
  Tooltip,
} from '@mantine/core';
import { TbFileTypeCsv } from 'react-icons/tb';
import { TbFilter } from 'react-icons/tb';
import { TbFilterFilled } from 'react-icons/tb';
import MonthPickerComponent from './MonthPickerComponent';
import WeekPicker from './WeekPicker';
import { endOfWeek, startOfWeek } from './WeekPickerUtils';
import DiaryPageFilterModal from './DiaryPageFilterModal';
import { useLocalStorage } from '@mantine/hooks';
import axiosInstance from '../../lib/axiosInstance';
import dayjs from 'dayjs';

type ViewModes = 'all' | 'week' | 'month';

function DiaryPage() {
  const { t } = useTranslation();

  const [dailyNotes, setDailyNotes] = useState<DailyNote[]>([]);
  const [allAttributes, setAllAttributes] = useState<NoteAttribute[]>([]);
  const [showDailyNotesToAdd, setShowDailyNotesToAdd] = useState(false);
  const [noteConfig, setNoteConfig] = useState<NoteConfiguration>({
    id: 1,
    noteAttributes: [],
  });
  const [isDataLoading, setIsDataLoading] = useState(false);

  const [viewMode, setViewMode] = useState<ViewModes>('week');
  // View Mode Month
  const [selectedMonth, setSelectedMonth] = useState<string>(
    dayjs().format('YYYY-MM-DD')
  );
  // View Mode Week
  const [selectedWeek, setSelectedWeek] = useState<string>(
    dayjs().format('YYYY-MM-DD')
  );

  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  const [filterConfig, setDiaryFilterStorage, removeDiaryFilterStorage] =
    useLocalStorage<DiaryFilterConfiguration | undefined>({
      key: 'diary-filter',
    });

  const getData = useCallback(() => {
    setIsDataLoading(true);

    let apiUrlDailyNote = 'DailyNotes';
    const apiUrlNoteConfig = 'NoteConfigurations';
    const apiAttributes = 'NoteAttributes';

    // Append start and endDate queries depending on viewMode
    if (viewMode === 'week') {
      let startDate = startOfWeek(selectedWeek);
      let endDate = endOfWeek(selectedWeek);

      apiUrlDailyNote =
        apiUrlDailyNote + `?startDate=${startDate}&endDate=${endDate}`;
    }

    if (viewMode === 'month') {
      const startDate: string = dayjs(selectedMonth)
        .startOf('month')
        .format('YYYY-MM-DD');
      const endDate: string = dayjs(selectedMonth)
        .endOf('month')
        .format('YYYY-MM-DD');

      apiUrlDailyNote =
        apiUrlDailyNote + `?startDate=${startDate}&endDate=${endDate}`;
    }

    axiosInstance
      .get<DailyNote[]>(apiUrlDailyNote)
      .then(async (dailyNotesResponse) => {
        dailyNotesResponse.data.sort(function (a, b) {
          return +new Date(b.date) - +new Date(a.date);
        });
        setDailyNotes(dailyNotesResponse.data);

        const noteConfigResponse = await axiosInstance.get<NoteConfiguration[]>(
          apiUrlNoteConfig
        );
        setNoteConfig(noteConfigResponse.data[0]);

        const allAttributesResponse = await axiosInstance.get<NoteAttribute[]>(
          apiAttributes
        );
        setAllAttributes(allAttributesResponse.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      })
      .finally(() => {
        setIsDataLoading(false);
      });
  }, [selectedWeek, selectedMonth, viewMode]);

  useEffect(() => {
    getData();
  }, [getData]);

  // Returns true if the filter applies and the dailyNote should be shown.
  const doesFilterApply = useCallback(
    (dailyNote: DailyNote) => {
      if (filterConfig === undefined) return true;

      let filterApply = false; // Tracks whether a filter from the localStorage could be applied.
      const filterApplyClauses: boolean[] = []; // Checks if the filter applies for each clause alone. These will get combined with AND / OR setting.

      for (let i = 0; i < filterConfig.clauses.length; i++) {
        const clause = filterConfig.clauses[i];

        filterApplyClauses[i] = false;

        if (dailyNote === undefined) return true;

        // Check all attributes of dailyNote and check if filter apply.
        for (let j = 0; j < dailyNote.attributes.length; j++) {
          const attribute = dailyNote.attributes[j];

          if (clause.element === attribute.name) {
            switch (clause.operator) {
              case '=':
                if (attribute.value === clause.value)
                  filterApplyClauses[i] = true;
                break;
              case '<':
                if (+attribute.value < +clause.value)
                  filterApplyClauses[i] = true;
                break;
              case '<=':
                if (+attribute.value <= +clause.value)
                  filterApplyClauses[i] = true;
                break;
              case '>':
                if (+attribute.value > +clause.value)
                  filterApplyClauses[i] = true;
                break;
              case '>=':
                if (+attribute.value >= +clause.value)
                  filterApplyClauses[i] = true;
                break;
              case 'contains':
                if (attribute.value.includes(clause.value))
                  filterApplyClauses[i] = true;
                break;
              case 'is empty':
                if (attribute.value === '') filterApplyClauses[i] = true;
                break;
            }
          }
        }

        // Check if all inner clauses fit together regarding logic gate.
        const logicGate = filterConfig.logicGate;

        if (logicGate === 'AND') {
          filterApply = filterApplyClauses.every(Boolean);
        } else if (logicGate === 'OR') {
          filterApply = filterApplyClauses.some(Boolean);
        } else if (logicGate === 'XOR') {
          filterApply = filterApplyClauses.filter(Boolean).length === 1;
        }
      }

      return filterApply;
    },
    [filterConfig]
  );

  // Check all dailyNotes if filter applies.
  useEffect(() => {
    if (filterConfig === undefined) {
      setIsFilterApplied(false);
    } else {
      setIsFilterApplied(true);
    }
  }, [filterConfig]);

  function createNewEntry() {
    window.scrollTo(0, 0);
    setShowDailyNotesToAdd(true);
  }

  async function exportAsCsv() {
    try {
      const response = await axiosInstance.get('DailyNotes/export', {
        responseType: 'blob', // Important for file download
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'daily_notes.csv';
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting file:', error);
    }
  }

  return (
    <>
      <Center>
        <Paper w='100%' m={20} mb={0} p={10} withBorder>
          <Grid justify='center' align='center' grow>
            <Grid.Col span={4}>
              <Center>
                <SegmentedControl
                  value={viewMode}
                  onChange={(e) => setViewMode(e as ViewModes)}
                  data={[
                    { label: 'All', value: 'all' },
                    { label: 'Week', value: 'week' },
                    { label: 'Month', value: 'month' },
                  ]}
                />
              </Center>
            </Grid.Col>

            <Grid.Col span='content'>
              <Center>
                {viewMode === 'month' && (
                  <MonthPickerComponent
                    selectedMonth={selectedMonth}
                    onSelectedMonthChange={(newDate) =>
                      setSelectedMonth(newDate)
                    }
                  />
                )}

                {viewMode === 'week' && (
                  <WeekPicker
                    selectedWeek={selectedWeek}
                    onSelectedWeekChange={(newDate) => {
                      setSelectedWeek(newDate);
                    }}
                  />
                )}
              </Center>
            </Grid.Col>

            <Grid.Col span={4}>
              <Group justify='center'>
                <Tooltip label={t('diaryPage.exportCsvTooltip')}>
                  <ActionIcon
                    size='lg'
                    variant='subtle'
                    onClick={() => exportAsCsv()}
                  >
                    <TbFileTypeCsv size='1.5rem' />
                  </ActionIcon>
                </Tooltip>

                <ActionIcon
                  size='lg'
                  variant='subtle'
                  onClick={() => {
                    setFilterModalOpen(true);
                  }}
                >
                  {isFilterApplied ? (
                    <TbFilterFilled size='1.5rem' />
                  ) : (
                    <TbFilter size='1.5rem' />
                  )}
                </ActionIcon>
              </Group>
            </Grid.Col>
          </Grid>
        </Paper>
      </Center>

      {showDailyNotesToAdd && (
        <DiaryEntry
          state='create'
          noteConfig={noteConfig}
          allAttributes={allAttributes}
          onNewDiaryEntrySave={() => {
            getData();
            setShowDailyNotesToAdd(false);
          }}
        />
      )}

      {isDataLoading && (
        <Center>
          <Loader color='blue' size={50} mt='20vh' />
        </Center>
      )}

      {!isDataLoading &&
        dailyNotes.map((dailyNote, index) =>
          doesFilterApply(dailyNote) ? (
            <DiaryEntry
              key={index}
              dailyNote={dailyNote}
              state='show'
              noteConfig={noteConfig}
              allAttributes={allAttributes}
              onDeleteEntry={() => {
                getData();
              }}
            />
          ) : (
            <div key={index}></div>
          )
        )}

      <ActionIcon
        aria-label='Create'
        color='blue'
        size='3.5rem'
        radius='xl'
        onClick={() => createNewEntry()}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          outline: '2px solid black',
        }}
      >
        <IoAdd size='2rem' />
      </ActionIcon>

      <DiaryPageFilterModal
        opened={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        allAttributes={allAttributes}
        diaryFilter={filterConfig}
        onSave={(filter: DiaryFilterConfiguration) => {
          setDiaryFilterStorage(filter);
          setIsFilterApplied(true);
          setFilterModalOpen(false);
        }}
        onReset={() => removeDiaryFilterStorage()}
      />
    </>
  );
}

export default DiaryPage;
