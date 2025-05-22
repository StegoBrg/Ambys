import {
  ActionIcon,
  Button,
  Center,
  em,
  Group,
  Modal,
  Paper,
  Select,
  Table,
  TextInput,
  Space,
} from '@mantine/core';
import { TbX } from 'react-icons/tb';
import {
  FilterOperators,
  DiaryFilterConfiguration,
  LogicGate,
  NoteConfiguration,
} from '../../Types';
import { useLocalStorage, useMediaQuery } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { IoAdd } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';

interface Props {
  opened: boolean;
  onClose: () => void;

  noteConfig: NoteConfiguration;
}

function DiaryPageFilterModal(props: Props) {
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
  const { t } = useTranslation();

  const defaultConfig: DiaryFilterConfiguration = {
    logicGate: 'AND',
    clauses: [
      {
        element: '',
        operator: '',
        value: '',
      },
    ],
  };
  const allAttributeNames = props.noteConfig.noteAttributes.map(
    (attr) => attr.name
  );

  const [diaryFilterStorage, setDiaryFilterStorage, removeDiaryFilterStorage] =
    useLocalStorage<DiaryFilterConfiguration | undefined>({
      key: 'diary-filter',
    });

  const [diaryFilter, setDiaryFilter] =
    useState<DiaryFilterConfiguration>(defaultConfig);

  useEffect(() => {
    if (diaryFilterStorage !== undefined) setDiaryFilter(diaryFilterStorage);
  }, [diaryFilterStorage]);

  function saveDiaryFilter() {
    // Saves the color coding configuration to the local storage.
    setDiaryFilterStorage(diaryFilter);
    props.onClose();
  }

  return (
    <Modal
      opened={props.opened}
      onClose={props.onClose}
      size='xl'
      fullScreen={isMobile}
    >
      <Paper withBorder p={10} mb={5}>
        <Table.ScrollContainer minWidth={500}>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th></Table.Th>
                <Table.Th>
                  {t('calendarPage.colorCodeFilter.modal.tColElement')}
                </Table.Th>
                <Table.Th>
                  {t('calendarPage.colorCodeFilter.modal.tColOperator')}
                </Table.Th>
                <Table.Th>
                  {t('calendarPage.colorCodeFilter.modal.tColValue')}
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {diaryFilter.clauses.map((clause, clauseIndex) => {
                return (
                  <Table.Tr key={clauseIndex}>
                    <Table.Td>
                      <Center>
                        <ActionIcon
                          variant='subtle'
                          size='lg'
                          color='red'
                          onClick={() => {
                            const filterTemp = structuredClone(diaryFilter);
                            filterTemp.clauses.splice(clauseIndex, 1);
                            setDiaryFilter(filterTemp);
                          }}
                        >
                          <TbX size='1.5rem' />
                        </ActionIcon>
                      </Center>
                    </Table.Td>

                    <Table.Td>
                      <Select
                        data={[
                          {
                            group: t(
                              'calendarPage.colorCodeFilter.modal.tElementAttributeDivider'
                            ),
                            items: allAttributeNames,
                          },
                        ]}
                        value={clause.element}
                        onChange={(e) => {
                          const filterTemp = structuredClone(diaryFilter);
                          filterTemp.clauses[clauseIndex].element = e ?? '';
                          setDiaryFilter(filterTemp);
                        }}
                      />
                    </Table.Td>
                    <Table.Td>
                      <Select
                        withCheckIcon={false}
                        data={[
                          {
                            group: t(
                              'calendarPage.colorCodeFilter.modal.tOperatorGeneralDivider'
                            ),
                            items: ['is empty', '='],
                          },
                          {
                            group: t(
                              'calendarPage.colorCodeFilter.modal.tOperatorNumberDivider'
                            ),
                            items: ['>', '<', '>=', '<='],
                          },
                          {
                            group: t(
                              'calendarPage.colorCodeFilter.modal.tOperatorTextDivider'
                            ),
                            items: ['contains'],
                          },
                        ]}
                        value={clause.operator}
                        onChange={(e) => {
                          const filterTemp = structuredClone(diaryFilter);
                          filterTemp.clauses[clauseIndex].operator =
                            (e as FilterOperators) ?? '';
                          setDiaryFilter(filterTemp);
                        }}
                      />
                    </Table.Td>
                    <Table.Td>
                      <TextInput
                        disabled={clause.operator === 'is empty'}
                        value={clause.value}
                        onChange={(e) => {
                          const filterTemp = structuredClone(diaryFilter);
                          filterTemp.clauses[clauseIndex].value =
                            e.target.value;
                          setDiaryFilter(filterTemp);
                        }}
                      />
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>

            <Table.Caption>
              <ActionIcon
                color='blue'
                size='xl'
                radius='xl'
                bd='2px solid black'
                onClick={() => {
                  {
                    const filterTemp = structuredClone(diaryFilter);
                    filterTemp.clauses.push({
                      element: '',
                      operator: '',
                      value: '',
                    });
                    setDiaryFilter(filterTemp);
                  }
                }}
              >
                <IoAdd size='2rem' />
              </ActionIcon>
            </Table.Caption>
          </Table>
        </Table.ScrollContainer>

        <Group>
          <Select
            disabled={diaryFilter.clauses.length <= 1}
            label={t(
              'calendarPage.colorCodeFilter.modal.logicalConnectiveSelect'
            )}
            data={['AND', 'OR', 'XOR']}
            value={diaryFilter.logicGate}
            defaultValue={'AND'}
            onChange={(e) => {
              const filterTemp = structuredClone(diaryFilter);
              filterTemp.logicGate = (e as LogicGate) ?? '';
              setDiaryFilter(filterTemp);
            }}
          />
        </Group>
      </Paper>

      <Space h='sm' />

      <Button onClick={saveDiaryFilter}>
        {t('calendarPage.colorCodeFilter.modal.save')}
      </Button>

      <Button
        style={{ float: 'right' }}
        variant='subtle'
        color='red'
        onClick={() => {
          removeDiaryFilterStorage();
          setDiaryFilter(defaultConfig);
          props.onClose();
        }}
      >
        {t('calendarPage.colorCodeFilter.modal.reset')}
      </Button>
    </Modal>
  );
}

export default DiaryPageFilterModal;
