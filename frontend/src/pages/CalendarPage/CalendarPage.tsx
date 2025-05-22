import {
  ActionIcon,
  Box,
  Center,
  em,
  Indicator,
  Modal,
  Paper,
  Stack,
  Title,
  Tooltip,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { Calendar } from '@mantine/dates';
import { useEffect, useState } from 'react';
import {
  ColorCodeConfiguration,
  DailyNote,
  NoteAttribute,
  NoteConfiguration,
} from '../../Types';
import DiaryEntry from '../Shared/DiaryEntry';
import { readLocalStorageValue, useMediaQuery } from '@mantine/hooks';
import { TbColorSwatch } from 'react-icons/tb';
import ColorCodeModal from './ColorCodeModal';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../lib/axiosInstance';

function CalendarPage() {
  const theme = useMantineTheme();
  const isDarkTheme = useMantineColorScheme().colorScheme === 'dark';
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
  const { t } = useTranslation();

  const [dailyNotes, setDailyNotes] = useState<DailyNote[]>([]);
  const [noteConfig, setNoteConfig] = useState<NoteConfiguration>();
  const [allAttributes, setAllAttributes] = useState<NoteAttribute[]>([]);

  const [dailyNoteDetailOpened, setDailyNoteDetailOpened] = useState(false);
  const [dailyNoteDetail, setDailyNoteDetail] = useState<
    DailyNote | undefined
  >();
  const [dailyNoteDetailDate, setDailyNoteDetailDate] = useState<Date>(
    new Date()
  );

  const [colorCodeModalOpened, setColorCodeModalOpened] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  function getData() {
    const apiUrlDailyNote = 'DailyNotes';
    const apiUrlNoteConfig = 'NoteConfigurations';
    const apiAttributes = 'NoteAttributes';

    axiosInstance
      .get<DailyNote[]>(apiUrlDailyNote)
      .then(async (dailyNotesResponse) => {
        setDailyNotes(dailyNotesResponse.data);

        axiosInstance
          .get<NoteConfiguration[]>(apiUrlNoteConfig)
          .then((noteConfigResponse) => {
            setNoteConfig(noteConfigResponse.data[0]);
          });

        axiosInstance
          .get<NoteAttribute[]>(apiAttributes)
          .then((attributesResponse) => {
            setAllAttributes(attributesResponse.data);
          });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  function getDailyNoteForDate(date: Date) {
    const offset = date.getTimezoneOffset();
    date = new Date(date.getTime() - offset * 60 * 1000);

    const formattedDate = date.toISOString().split('T')[0];

    const dailyNote = dailyNotes.find((x) => x.date === formattedDate);

    return dailyNote;
  }

  // Returns hex code of color according of color coding filter from localstorage.
  // Returns undefined if no filter could be found for the given date.
  function getColorCodingForDate(date: Date): string | undefined {
    const dailyNote = getDailyNoteForDate(date);

    const config = readLocalStorageValue<ColorCodeConfiguration | undefined>({
      key: 'color-code-config',
    });
    if (config === undefined) return undefined;

    for (let configGroup = 0; configGroup < config.length; configGroup++) {
      let filterApply = false; // Tracks whether a filter from the localStorage could be applied.
      const filterApplyClauses: boolean[] = []; // Checks if the filter applies for each clause alone. These will get combined with AND / OR setting.

      for (let i = 0; i < config[configGroup].clauses.length; i++) {
        const clause = config[configGroup].clauses[i];

        filterApplyClauses[i] = false;

        if (dailyNote === undefined) {
          // Check if nonexistant dailyNote should be color coded.
          if (
            clause.element === 'DailyNote' &&
            clause.operator === 'is empty'
          ) {
            filterApplyClauses[i] = true;
          }
        } else {
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
        }
      }

      // Check if all inner clauses fit together regarding logic gate.
      const logicGate = config[configGroup].logicGate;

      if (logicGate === 'AND') {
        filterApply = filterApplyClauses.every(Boolean);
      } else if (logicGate === 'OR') {
        filterApply = filterApplyClauses.some(Boolean);
      } else if (logicGate === 'XOR') {
        filterApply = filterApplyClauses.filter(Boolean).length === 1;
      }

      if (filterApply) {
        return config[configGroup].colorHex;
      }
    }

    // Return undefined if no color code filter could be applied.
    return undefined;
  }

  return (
    <>
      <Center>
        <Stack>
          <Paper m={10} p={10} withBorder>
            <Center>
              <Tooltip label={t('calendarPage.colorCodeFilter.tooltip')}>
                <Indicator
                  disabled={
                    readLocalStorageValue<ColorCodeConfiguration | undefined>({
                      key: 'color-code-config',
                    }) === undefined
                  }
                >
                  <ActionIcon
                    size='lg'
                    variant='subtle'
                    onClick={() => setColorCodeModalOpened(true)}
                  >
                    <TbColorSwatch size='1.5rem' />
                  </ActionIcon>
                </Indicator>
              </Tooltip>
            </Center>
          </Paper>

          <Paper
            shadow='xl'
            bg={isDarkTheme ? theme.colors.dark[7] : undefined}
          >
            <Calendar
              size='lg'
              highlightToday={true}
              getDayProps={(date) => ({
                onClick: () => {
                  setDailyNoteDetailOpened(true);
                  setDailyNoteDetail(getDailyNoteForDate(date));
                  setDailyNoteDetailDate(date);
                },
              })}
              weekendDays={[]} // Removes weekend highlight which may conflict with color coding.
              renderDay={(date) => {
                const day = date.getDate();

                return (
                  <Box fz='1.2rem' fw='bolder' c={getColorCodingForDate(date)}>
                    {day}
                  </Box>
                );
              }}
            />
          </Paper>
        </Stack>
      </Center>

      {noteConfig !== undefined && (
        <ColorCodeModal
          opened={colorCodeModalOpened}
          onClose={() => setColorCodeModalOpened(false)}
          noteConfig={noteConfig}
        />
      )}

      {/* DailyNoteDetailModal */}
      {noteConfig !== undefined && (
        <Modal
          title={
            dailyNoteDetail !== undefined ? (
              <div>
                <Title order={3}>{t('calendarPage.detailView.viewEdit')}</Title>
              </div>
            ) : (
              <div>
                <Title order={3}>{t('calendarPage.detailView.add')}</Title>
              </div>
            )
          }
          closeButtonProps={{ size: 'lg' }}
          opened={dailyNoteDetailOpened}
          onClose={() => setDailyNoteDetailOpened(false)}
          size='lg'
          fullScreen={isMobile}
        >
          <DiaryEntry
            state={dailyNoteDetail !== undefined ? 'show' : 'create'}
            dailyNote={dailyNoteDetail}
            noteConfig={noteConfig}
            allAttributes={allAttributes}
            dateOnCreate={dailyNoteDetailDate}
            margin={0}
            disableDateEdit
          />
        </Modal>
      )}
    </>
  );
}

export default CalendarPage;
