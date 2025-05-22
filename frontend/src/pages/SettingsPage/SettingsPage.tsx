import {
  Center,
  Stack,
  Paper,
  Select,
  useMantineTheme,
  Button,
  TextInput,
  Group,
  Card,
  Text,
  ActionIcon,
  Popover,
  NavLink,
  useMantineColorScheme,
  Box,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import {
  NoteAttribute,
  NoteAttributeElement,
  NoteConfiguration,
  SettingsCategories,
  SettingsCategory,
} from '../../Types';
import AddNoteAttributeModal from './AddNoteAttributeModal';
import CheckBox from '../Shared/NoteAttributeElements/CheckBox';
import NumberInputEl from '../Shared/NoteAttributeElements/NumberInput';
import Scale10 from '../Shared/NoteAttributeElements/Scale10';
import TextArea from '../Shared/NoteAttributeElements/TextArea';
import TextField from '../Shared/NoteAttributeElements/TextField';
import { TbCheck, TbTrash, TbX } from 'react-icons/tb';
import { TbPencil } from 'react-icons/tb';
import DeleteAttributeConfirmationModal from './DeleteAttributeConfirmationModal';
import NoteConfigPreviewDialog from './NoteConfigPreviewDialog';
import { IoAdd } from 'react-icons/io5';
import _ from 'lodash';
import { notifications } from '@mantine/notifications';
import axiosInstance from '../../lib/axiosInstance';

function SettingsPage() {
  const { t, i18n } = useTranslation();
  const theme = useMantineTheme();
  const isDarkTheme = useMantineColorScheme().colorScheme === 'dark';

  const [currCategory, setCurrCategory] = useState<SettingsCategory>('general');

  const [language, setLanguage] = useState<string>(
    i18n.language === 'en' ? 'English' : 'Deutsch'
  );

  const [noteConfigId, setNoteConfigId] = useState<number>(-1);
  const [noteAttributes, setNoteAttributes] = useState<NoteAttribute[]>([]);
  const [addNoteAttributeModalOpen, setAddNoteAttributeModalOpen] =
    useState(false);
  const [attributeRename, setAttributeRename] = useState('');
  useState(false);
  const [attributeToDelete, setAttributeToDelete] =
    useState<NoteAttribute | null>(null);

  const [noteConfigAttributes, setNoteConfigAttributes] = useState<string[]>([
    '',
  ]);
  // State is used to determine if the config has been modified and sould enable the save button.
  const [initialConfigAttributes, setInitialConfigAttributes] = useState<
    string[]
  >([]);
  const [noteConfigSaveEnabled, setNoteConfigSaveEnabled] = useState(false);

  const [noteConfigPreviewDialogOpen, setNoteConfigPreviewDialogOpen] =
    useState(false);
  const [previewNoteConfig, setPreviewNoteConfig] =
    useState<NoteConfiguration>();

  const allAttributeNames = noteAttributes.map((attribute) => attribute.name);

  useEffect(() => {
    getAllAttributes();
    getNoteConfig();
  }, []);

  useEffect(() => {
    if (_.isEqual(noteConfigAttributes, initialConfigAttributes)) {
      setNoteConfigSaveEnabled(false);
    } else {
      setNoteConfigSaveEnabled(true);
    }
  }, [initialConfigAttributes, noteConfigAttributes]);

  function changeLanguage() {
    switch (language) {
      case 'Deutsch':
        i18n.changeLanguage('de');
        break;
      case 'English':
        i18n.changeLanguage('en');
        break;
    }
  }

  function getAllAttributes() {
    axiosInstance
      .get<NoteAttribute[]>('NoteAttributes')
      .then((response) => {
        setNoteAttributes(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  function renameAttribute(attributeId: number, attribute: NoteAttribute) {
    axiosInstance
      .put('NoteAttributes/' + attributeId, attribute)
      .then(() => {
        getAllAttributes();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  function getPreviewElement(
    attributeName: string,
    elementType: NoteAttributeElement
  ) {
    switch (elementType) {
      case 'scale10':
        return (
          <Scale10
            title={attributeName}
            value={0}
            onChange={() => {}}
            editable={true}
          />
        );

      case 'textarea':
        return (
          <TextArea
            title={attributeName}
            value=''
            onChange={() => {}}
            editable={true}
          />
        );

      case 'textfield':
        return (
          <TextField
            title={attributeName}
            value=''
            onChange={() => {}}
            editable={true}
          />
        );

      case 'numberinput':
        return (
          <NumberInputEl
            title={attributeName}
            value={0}
            onChange={() => {}}
            editable={true}
          />
        );

      case 'checkbox':
        return (
          <CheckBox
            title={attributeName}
            value={false}
            onChange={() => {}}
            editable={true}
          />
        );
    }
  }

  function getNoteConfigFromNames() {
    // Create NoteConfig list of the selected names and sort to make sure of the correct sequence.
    const selectedNoteConfiguration = noteAttributes
      .filter((attribute) => noteConfigAttributes.includes(attribute.name))
      .sort(
        (a, b) =>
          noteConfigAttributes.indexOf(a.name) -
          noteConfigAttributes.indexOf(b.name)
      );

    return { id: 1, noteAttributes: selectedNoteConfiguration };
  }

  function getNoteConfig() {
    axiosInstance
      .get<NoteConfiguration[]>('NoteConfigurations')
      .then((response) => {
        setNoteConfigId(response.data[0].id);
        setNoteConfigAttributes(
          response.data[0].noteAttributes.map((attribute: NoteAttribute) => {
            return attribute.name;
          })
        );

        setInitialConfigAttributes(
          response.data[0].noteAttributes.map((attribute: NoteAttribute) => {
            return attribute.name;
          })
        );
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  function saveNoteConfig() {
    const selectedNoteConfiguration = noteAttributes
      .filter((attribute) => noteConfigAttributes.includes(attribute.name))
      .sort(
        (a, b) =>
          noteConfigAttributes.indexOf(a.name) -
          noteConfigAttributes.indexOf(b.name)
      );

    axiosInstance
      .put(`NoteConfigurations/${noteConfigId}`, {
        noteAttributes: selectedNoteConfiguration,
      })
      .then(() => {
        notifications.show({
          title: t('settingsPage.noteConfig.saveToast.successTitle'),
          message: t('settingsPage.noteConfig.saveToast.successDescription'),
          icon: <TbCheck size={20} />,
          color: 'green',
          position: 'bottom-center',
        });
      })
      .catch((error) => {
        console.error('Error:', error);

        notifications.show({
          title: t('settingsPage.noteConfig.saveToast.errorTitle'),
          message: t('settingsPage.noteConfig.saveToast.errorDescription'),
          icon: <TbX size={20} />,
          color: 'red',
          position: 'bottom-center',
        });
      });
  }

  return (
    <>
      <Center mt='2rem'>
        <Stack>
          {SettingsCategories.map(
            (category: SettingsCategory, index: number) => {
              return (
                <NavLink
                  label={t(`settingsPage.categories.${category}`)}
                  key={index}
                  onClick={() => {
                    setCurrCategory(category);
                  }}
                  active={category == currCategory}
                />
              );
            }
          )}
          {currCategory === 'general' && (
            <Paper bg={isDarkTheme ? theme.colors.dark[6] : 'white'} p='md'>
              <Select
                label={t('settingsPage.language.title')}
                description={t('settingsPage.language.description')}
                data={['Deutsch', 'English']}
                value={language}
                onChange={(_value) => setLanguage(_value ?? i18n.language)}
              />

              <Button mt='2rem' onClick={() => changeLanguage()}>
                {t('settingsPage.save')}
              </Button>
            </Paper>
          )}

          {currCategory === 'noteAttributes' && (
            <Paper
              bg={isDarkTheme ? theme.colors.dark[6] : 'white'}
              p='md'
              w='23.75rem'
            >
              {noteAttributes.map((attribute: NoteAttribute, index: number) => (
                <Card mb={10} withBorder shadow='sm' radius='md' key={index}>
                  <Card.Section withBorder inheritPadding py='xs'>
                    <Group justify='flex-end' gap='xs'>
                      <Text fw={500} fs='italic' mr='auto'>
                        {attribute.name}
                      </Text>

                      <Popover
                        width={300}
                        position='bottom'
                        withArrow
                        trapFocus
                        shadow='md'
                      >
                        <Popover.Target>
                          <ActionIcon variant='subtle' color='blue'>
                            <TbPencil />
                          </ActionIcon>
                        </Popover.Target>
                        <Popover.Dropdown>
                          <TextInput
                            label={t('settingsPage.noteAttributes.renameTitle')}
                            placeholder={t(
                              'settingsPage.noteAttributes.renamePlaceholder'
                            )}
                            value={attributeRename}
                            onChange={(e) =>
                              setAttributeRename(e.currentTarget.value)
                            }
                            size='xs'
                          />

                          <Button
                            mt={10}
                            size='compact-md'
                            onClick={() => {
                              const newAttribute = { ...attribute };
                              newAttribute.name = attributeRename;
                              renameAttribute(attribute.id, newAttribute);
                              setAttributeRename('');
                            }}
                          >
                            {t('settingsPage.noteAttributes.renameButton')}
                          </Button>
                        </Popover.Dropdown>
                      </Popover>

                      <ActionIcon
                        variant='subtle'
                        color='red'
                        onClick={() => {
                          setAttributeToDelete(attribute);
                        }}
                      >
                        <TbTrash />
                      </ActionIcon>
                    </Group>
                  </Card.Section>
                  {getPreviewElement(attribute.name, attribute.element)}
                </Card>
              ))}

              <Center>
                <ActionIcon
                  color='blue'
                  size='xl'
                  radius='xl'
                  bd='2px solid black'
                  onClick={() => {
                    setAddNoteAttributeModalOpen(true);
                  }}
                >
                  <IoAdd size='2rem' />
                </ActionIcon>
              </Center>

              <AddNoteAttributeModal
                open={addNoteAttributeModalOpen}
                onClose={() => setAddNoteAttributeModalOpen(false)}
                onSave={() => getAllAttributes()}
              />

              <DeleteAttributeConfirmationModal
                opened={attributeToDelete !== null}
                onClose={() => {
                  setAttributeToDelete(null);
                }}
                onDelete={() => getAllAttributes()}
                attribute={attributeToDelete}
              />
            </Paper>
          )}

          {currCategory === 'noteConfig' && (
            <>
              <Paper
                bg={isDarkTheme ? theme.colors.dark[6] : 'white'}
                p='md'
                w='23.75rem'
              >
                <Box mb='md'>
                  <Button
                    mr='xs'
                    onClick={() => {
                      saveNoteConfig();
                    }}
                    disabled={!noteConfigSaveEnabled}
                  >
                    {t('settingsPage.noteConfig.save')}
                  </Button>

                  <Button
                    onClick={() => {
                      setPreviewNoteConfig(getNoteConfigFromNames());
                      setNoteConfigPreviewDialogOpen(true);
                    }}
                  >
                    {t('settingsPage.noteConfig.preview')}
                  </Button>
                </Box>

                {noteConfigAttributes.map(
                  (attribute: string, index: number) => (
                    <Select
                      data={allAttributeNames}
                      value={attribute}
                      onChange={(e) => {
                        if (e === null) return;
                        const newNoteConfigAttributes = [
                          ...noteConfigAttributes,
                        ];
                        newNoteConfigAttributes[index] = e;
                        setNoteConfigAttributes(newNoteConfigAttributes);
                      }}
                      key={index}
                      mb={'sm'}
                      clearable
                      onClear={() => {
                        const newNoteConfigAttributes = [
                          ...noteConfigAttributes,
                        ];
                        newNoteConfigAttributes.splice(index, 1);
                        setNoteConfigAttributes(newNoteConfigAttributes);
                      }}
                    />
                  )
                )}

                <Center>
                  <ActionIcon
                    color='blue'
                    size='xl'
                    radius='xl'
                    bd='2px solid black'
                    onClick={() => {
                      const newNoteConfigAttributes = [...noteConfigAttributes];
                      newNoteConfigAttributes.push(allAttributeNames[0]);
                      setNoteConfigAttributes(newNoteConfigAttributes);
                    }}
                  >
                    <IoAdd size='2rem' />
                  </ActionIcon>
                </Center>
              </Paper>
            </>
          )}
        </Stack>
      </Center>

      {previewNoteConfig !== undefined && (
        <NoteConfigPreviewDialog
          opened={noteConfigPreviewDialogOpen}
          onClose={() => setNoteConfigPreviewDialogOpen(false)}
          noteConfig={previewNoteConfig}
          allAttributes={noteAttributes}
        />
      )}
    </>
  );
}

export default SettingsPage;
