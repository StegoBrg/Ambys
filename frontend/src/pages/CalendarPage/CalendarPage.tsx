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
import {
  readLocalStorageValue,
  useLocalStorage,
  useMediaQuery,
} from '@mantine/hooks';
import { TbColorSwatch } from 'react-icons/tb';
import ColorCodeModal from './ColorCodeModal';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../lib/axiosInstance';
import { getColorCodingForDate, getDailyNoteForDate } from './lib';

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

  const [
    colorCodeConfigStorage,
    setColorCodeConfigStorage,
    removeColorCodeConfigStorage,
  ] = useLocalStorage<ColorCodeConfiguration | undefined>({
    key: 'color-code-config',
  });

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
                  setDailyNoteDetail(getDailyNoteForDate(date, dailyNotes));
                  setDailyNoteDetailDate(date);
                },
              })}
              weekendDays={[]} // Removes weekend highlight which may conflict with color coding.
              renderDay={(date) => {
                const day = date.getDate();

                return (
                  <Box
                    fz='1.2rem'
                    fw='bolder'
                    c={getColorCodingForDate(
                      date,
                      colorCodeConfigStorage,
                      dailyNotes
                    )}
                  >
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
          onSave={(config) => {
            setColorCodeConfigStorage(config);
          }}
          onReset={() => {
            removeColorCodeConfigStorage();
          }}
          colorCodeConfig={colorCodeConfigStorage}
          allAttributes={allAttributes}
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
