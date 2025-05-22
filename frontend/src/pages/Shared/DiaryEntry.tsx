import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Center,
  Divider,
  em,
  Grid,
  Menu,
  Paper,
  Popover,
  Stack,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import 'dayjs/locale/de';
import 'dayjs/locale/en';
import dayjs from 'dayjs';
import {
  DailyNote,
  DailyNoteAttribute,
  NoteAttribute,
  NoteAttributeElement,
  NoteConfiguration,
} from '../../Types';
import { useClickOutside, useMediaQuery } from '@mantine/hooks';
import CheckBox from './NoteAttributeElements/CheckBox';
import NumberInputEl from './NoteAttributeElements/NumberInput';
import Scale10 from './NoteAttributeElements/Scale10';
import TextArea from './NoteAttributeElements/TextArea';
import TextField from './NoteAttributeElements/TextField';
import { TbEdit } from 'react-icons/tb';
import { TbTrash } from 'react-icons/tb';
import { TbX } from 'react-icons/tb';
import { TbCheck } from 'react-icons/tb';
import { notifications } from '@mantine/notifications';
import DeleteDiaryEntryConfirmationModal from './DeleteDiaryEntryConfirmationModal';
import { TbAsterisk } from 'react-icons/tb';
import _ from 'lodash';
import axiosInstance from '../../lib/axiosInstance';
import { IoAdd } from 'react-icons/io5';

type State = 'create' | 'edit' | 'show';

interface Props {
  state: State;
  hideEditDeleteIcons?: boolean;
  noteConfig: NoteConfiguration;
  allAttributes: NoteAttribute[];

  margin?: number;
  padding?: number;
  disableDateEdit?: boolean;
  dateOnCreate?: Date;

  // This prop is not needed if a new entry is created.
  dailyNote?: DailyNote;

  onNewDiaryEntrySave?: () => void;
  onDeleteEntry?: () => void;
}

function DiaryEntry(props: Props) {
  const { t } = useTranslation();
  const theme = useMantineTheme();
  const isDarkTheme = useMantineColorScheme().colorScheme === 'dark';
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  const [state, setState] = useState<State>(props.state);

  const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false);

  const initialDateCreate =
    props.dateOnCreate !== undefined ? props.dateOnCreate : new Date();

  const [selectedDate, setSelectedDate] = useState<Date>(
    props.dailyNote?.date !== undefined
      ? new Date(props.dailyNote.date)
      : initialDateCreate
  );
  const [initialDate, setInitialDate] = useState(selectedDate);

  const [attributes, setAttributes] = useState(props.dailyNote?.attributes);
  const [initialAttributes, setInitialAttributes] = useState(attributes);

  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);

  // If dailyNote is not given in props, fill attributes state with default attributes from noteConfig
  useEffect(() => {
    if (attributes === undefined) {
      const attributesFromConfig: DailyNoteAttribute[] = [];

      props.noteConfig.noteAttributes.map((noteAttribute) => {
        attributesFromConfig.push({
          name: noteAttribute.name,
          value: '',
        });
      });

      setAttributes(attributesFromConfig);
    }
  }, [attributes, props.noteConfig]);

  // Mark unsaved changes when leaving editing state.
  useEffect(() => {
    if (state !== 'edit') {
      if (
        initialDate !== selectedDate ||
        !_.isEqual(initialAttributes, attributes)
      ) {
        // Changes have been made.
        setUnsavedChanges(true);
      } else {
        setUnsavedChanges(false);
      }
    }
  }, [state, initialAttributes, initialDate, selectedDate, attributes]);

  function getAttributeElement(
    attributeName: string,
    elementType: NoteAttributeElement,
    elementValue: string
  ) {
    switch (elementType) {
      case 'scale10':
        return (
          <Scale10
            title={attributeName}
            value={+elementValue}
            onChange={(e) => {
              if (attributes === undefined) return;
              const newAttributes: DailyNoteAttribute[] = attributes.map(
                (attribute) =>
                  attribute.name === attributeName
                    ? { ...attribute, value: String(e) }
                    : attribute
              );

              setAttributes(newAttributes);
            }}
            editable={state !== 'show'}
          />
        );

      case 'textarea':
        return (
          <TextArea
            title={attributeName}
            value={elementValue}
            onChange={(e) => {
              if (attributes === undefined) return;
              const newAttributes: DailyNoteAttribute[] = attributes.map(
                (attribute) =>
                  attribute.name === attributeName
                    ? { ...attribute, value: e }
                    : attribute
              );

              setAttributes(newAttributes);
            }}
            editable={state !== 'show'}
          />
        );

      case 'textfield':
        return (
          <TextField
            title={attributeName}
            value={elementValue}
            onChange={(e) => {
              if (attributes === undefined) return;
              const newAttributes: DailyNoteAttribute[] = attributes.map(
                (attribute) =>
                  attribute.name === attributeName
                    ? { ...attribute, value: e }
                    : attribute
              );

              setAttributes(newAttributes);
            }}
            editable={state !== 'show'}
          />
        );

      case 'numberinput':
        return (
          <NumberInputEl
            title={attributeName}
            value={+elementValue}
            onChange={(e) => {
              if (attributes === undefined) return;
              const newAttributes: DailyNoteAttribute[] = attributes.map(
                (attribute) =>
                  attribute.name === attributeName
                    ? { ...attribute, value: String(e) }
                    : attribute
              );

              setAttributes(newAttributes);
            }}
            editable={state !== 'show'}
          />
        );

      case 'checkbox': {
        const value = elementValue === 'true' ? true : false;
        return (
          <CheckBox
            title={attributeName}
            value={value}
            onChange={(e) => {
              if (attributes === undefined) return;
              const newAttributes: DailyNoteAttribute[] = attributes.map(
                (attribute) =>
                  attribute.name === attributeName
                    ? { ...attribute, value: String(e) }
                    : attribute
              );

              setAttributes(newAttributes);
            }}
            editable={state !== 'show'}
          />
        );
      }
    }
  }

  function getNoteAttributeByName(name: string) {
    return props.allAttributes.find((attribute) => attribute.name === name);
  }

  function createNewEntry() {
    const apiUrl = 'DailyNotes';

    let selectedDateTemp = selectedDate;

    // Deal with time zone issues.
    const offset = selectedDateTemp.getTimezoneOffset();
    selectedDateTemp = new Date(
      selectedDateTemp.getTime() - offset * 60 * 1000
    );

    const newEntry: DailyNote = {
      id: 0,
      date: selectedDateTemp.toISOString().split('T')[0],
      attributes: attributes ?? [],
    };

    axiosInstance(apiUrl, {
      method: 'POST',
      data: newEntry,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(() => {
        setState('show');

        notifications.show({
          title: t('diaryPage.diaryEntry.saveToast.successTitle'),
          message: t('diaryPage.diaryEntry.saveToast.successDescription'),
          icon: <TbCheck size={20} />,
          color: 'green',
          position: 'bottom-center',
        });

        if (props.onNewDiaryEntrySave !== undefined)
          props.onNewDiaryEntrySave();
      })
      .catch((error) => {
        console.error('Error:', error);

        notifications.show({
          title: t('diaryPage.diaryEntry.saveToast.errorTitle'),
          message: t('diaryPage.diaryEntry.saveToast.errorDescription'),
          icon: <TbX size={20} />,
          color: 'red',
          position: 'bottom-center',
        });
      });
  }

  function editEntry() {
    // Update initial values.
    setInitialDate(selectedDate);
    setInitialAttributes(attributes);
    setUnsavedChanges(false);

    // DailyNote prop need to be present to know the id of the entry to edit.
    if (props.dailyNote?.id === undefined) {
      notifications.show({
        title: 'Error',
        message: 'Could not find id of element to edit.',
        icon: <TbX size={20} />,
        color: 'red',
        position: 'bottom-center',
      });
      return;
    }

    const apiUrl = `DailyNotes/${props.dailyNote.id}`;

    let selectedDateTemp = selectedDate;

    // Deal with time zone issues.
    const offset = selectedDateTemp.getTimezoneOffset();
    selectedDateTemp = new Date(
      selectedDateTemp.getTime() - offset * 60 * 1000
    );

    const editedEntry: DailyNote = {
      id: props.dailyNote.id,
      date: selectedDateTemp.toISOString().split('T')[0],
      attributes: attributes ?? [],
    };

    axiosInstance(apiUrl, {
      method: 'PUT',
      data: editedEntry,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(() => {
        setState('show');

        notifications.show({
          title: t('diaryPage.diaryEntry.editToast.successTitle'),
          message: t('diaryPage.diaryEntry.editToast.successDescription'),
          icon: <TbCheck size={20} />,
          color: 'green',
          position: 'bottom-center',
        });
      })
      .catch((error) => {
        console.error('Error:', error);

        notifications.show({
          title: t('diaryPage.diaryEntry.editToast.errorTitle'),
          message: t('diaryPage.diaryEntry.editToast.errorDescription'),
          icon: <TbX size={20} />,
          color: 'red',
          position: 'bottom-center',
        });
      });
  }

  // Close the Popover on outside click.
  const popoverRef = useClickOutside(() => setDatePickerOpen(false));

  // Create unique array of attributes that are not in the diaryentry yet.
  const namesOfAttributesInEntry = new Set(
    attributes?.map((item) => item.name)
  );
  const attributesNotInEntry = props.allAttributes.filter(
    (item) => !namesOfAttributesInEntry.has(item.name)
  );

  return (
    <>
      <Paper
        m={props.margin ?? 20}
        shadow='xl'
        bg={isDarkTheme ? theme.colors.dark[7] : undefined}
        p={props.padding ?? 20}
        withBorder={state === 'show'}
      >
        <Grid align='center'>
          <Grid.Col span={4}>
            {unsavedChanges &&
              (isMobile ? (
                <TbAsterisk color='red' size={20} />
              ) : (
                <Badge ml={10} color='teal'>
                  {t('diaryPage.diaryEntry.unsavedChanges')}
                </Badge>
              ))}
          </Grid.Col>
          <Grid.Col span={4}>
            <Center>
              <Popover
                opened={datePickerOpen}
                onClose={() => {
                  setDatePickerOpen(false);
                }}
                disabled={state === 'show' || props.disableDateEdit}
              >
                <Popover.Target>
                  <Box
                    onClick={() => setDatePickerOpen((o) => !o)}
                    style={{
                      cursor: 'pointer',
                      fontWeight: 'bolder',
                      fontSize: '2rem',
                      border:
                        state === 'show' || props.disableDateEdit
                          ? 'none'
                          : '1px dashed gray',
                      padding: '0.5rem',
                    }}
                  >
                    {dayjs(selectedDate).format(
                      t('diaryPage.diaryEntry.dates.format')
                    )}
                  </Box>
                </Popover.Target>
                <Popover.Dropdown ref={popoverRef}>
                  <DatePicker
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e as Date);
                      setDatePickerOpen(false);
                    }}
                    size='lg'
                    locale={t('diaryPage.diaryEntry.dates.dayjsLocale')}
                    highlightToday
                  />
                </Popover.Dropdown>
              </Popover>
            </Center>
          </Grid.Col>

          <Grid.Col
            span={4}
            hidden={props.hideEditDeleteIcons || state === 'create'}
          >
            <ActionIcon
              size={isMobile ? 'md' : 'xl'}
              variant='subtle'
              color='red'
              mr={isMobile ? 0 : 'md'}
              style={{ float: 'right' }}
              onClick={() => setConfirmDeleteModalOpen(true)}
            >
              <TbTrash size='2rem' />
            </ActionIcon>

            <ActionIcon
              size={isMobile ? 'md' : 'xl'}
              variant='subtle'
              onClick={() => {
                if (state === 'show') {
                  setState('edit');
                } else {
                  setState('show');
                }
              }}
              color={state === 'edit' ? 'teal' : 'blue'}
              mr={isMobile ? 'sm' : 'md'}
              style={{ float: 'right' }}
            >
              <TbEdit size='2rem' />
            </ActionIcon>
          </Grid.Col>
        </Grid>

        <Divider variant='dashed' />

        <Stack mb={10}>
          {attributes?.map((attribute, index) => {
            const noteAttribute = getNoteAttributeByName(
              attribute.name
            )?.element;

            if (noteAttribute === undefined) {
              return null;
            } else {
              return (
                <Box key={index}>
                  {getAttributeElement(
                    attribute.name,
                    noteAttribute,
                    attribute.value
                  )}
                </Box>
              );
            }
          })}
        </Stack>

        {state !== 'show' && attributes && (
          <>
            {attributesNotInEntry.length > 0 && (
              <Center>
                <Menu>
                  <Menu.Target>
                    <ActionIcon color='blue' size='2.5rem' radius='xl' mb={20}>
                      <IoAdd size='1.5rem' />
                    </ActionIcon>
                  </Menu.Target>

                  <Menu.Dropdown>
                    {attributesNotInEntry.map((attribute, index) => (
                      <Menu.Item
                        key={index}
                        onClick={() => {
                          const newAttributes = [...attributes];
                          newAttributes.push({
                            name: attribute.name,
                            value: '',
                          });

                          setAttributes(newAttributes);
                        }}
                      >
                        {attribute.name}
                      </Menu.Item>
                    ))}
                  </Menu.Dropdown>
                </Menu>
              </Center>
            )}

            <Button
              onClick={() => {
                if (state === 'create') {
                  createNewEntry();
                } else {
                  editEntry();
                }
              }}
              mr='md'
            >
              {t('diaryPage.diaryEntry.saveButton')}
            </Button>

            <Button
              onClick={() => {
                setState('show');
              }}
              variant='outline'
            >
              {t('diaryPage.diaryEntry.cancelButton')}
            </Button>
          </>
        )}
      </Paper>

      <DeleteDiaryEntryConfirmationModal
        opened={confirmDeleteModalOpen}
        onClose={function (): void {
          setConfirmDeleteModalOpen(false);
        }}
        dailyNote={props.dailyNote}
        onDelete={() => {
          setConfirmDeleteModalOpen(false);
          notifications.show({
            title: t('diaryPage.diaryEntry.deleteToast.successTitle'),
            message: t('diaryPage.diaryEntry.deleteToast.successDescription'),
            icon: <TbCheck size={20} />,
            color: 'green',
            position: 'bottom-center',
          });

          if (props.onDeleteEntry) props.onDeleteEntry();
        }}
      />
    </>
  );
}

export default DiaryEntry;
