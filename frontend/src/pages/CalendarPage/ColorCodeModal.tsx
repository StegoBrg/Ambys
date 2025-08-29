import {
  ActionIcon,
  Button,
  Center,
  ColorInput,
  em,
  Group,
  Modal,
  Paper,
  Select,
  Table,
  TextInput,
  Title,
  Space,
} from '@mantine/core';
import { TbTrash, TbX } from 'react-icons/tb';
import {
  FilterOperators,
  ColorCodeConfiguration,
  LogicGate,
  NoteAttribute,
} from '../../Types';
import { useMediaQuery } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { IoAdd } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';

interface Props {
  opened: boolean;
  onClose: () => void;
  onSave: (config: ColorCodeConfiguration) => void;
  onReset: () => void;

  allAttributes: NoteAttribute[];
  colorCodeConfig?: ColorCodeConfiguration;
}

function ColorCodeModal(props: Props) {
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
  const { t } = useTranslation();

  const defaultConfig: ColorCodeConfiguration = [
    {
      logicGate: 'AND',
      clauses: [
        {
          element: '',
          operator: '',
          value: '',
        },
      ],
      colorHex: '',
    },
  ];

  const allAttributeNames = props.allAttributes.map((attr) => attr.name);

  const [colorCodeConfig, setColorCodeConfig] =
    useState<ColorCodeConfiguration>(props.colorCodeConfig ?? defaultConfig);

  useEffect(() => {
    if (props.colorCodeConfig) setColorCodeConfig(props.colorCodeConfig);
  }, [props.colorCodeConfig]);

  function saveColorCoding() {
    // Saves the color coding configuration to the local storage.
    props.onSave(colorCodeConfig);
    props.onClose();
  }

  return (
    <Modal
      opened={props.opened}
      onClose={props.onClose}
      size='xl'
      fullScreen={isMobile}
    >
      {colorCodeConfig.map((colorCodeConfigObj, colorConfigIndex) => {
        return (
          <Paper withBorder p={10} key={colorConfigIndex} mb={5}>
            <Group>
              <Title order={3}>
                {t('calendarPage.colorCodeFilter.modal.groupName')}{' '}
                {colorConfigIndex + 1}
              </Title>
              <ActionIcon
                size='md'
                variant='subtle'
                color='red'
                onClick={() => {
                  const colorCodeConfigTemp = [...colorCodeConfig];
                  colorCodeConfigTemp.splice(colorConfigIndex, 1);
                  setColorCodeConfig(colorCodeConfigTemp);
                }}
              >
                <TbTrash size='2rem' />
              </ActionIcon>
            </Group>

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
                  {colorCodeConfigObj.clauses.map((clause, clauseIndex) => {
                    return (
                      <Table.Tr key={clauseIndex}>
                        <Table.Td>
                          <Center>
                            <ActionIcon
                              variant='subtle'
                              size='lg'
                              color='red'
                              onClick={() => {
                                const colorCodeConfigTemp = [
                                  ...colorCodeConfig,
                                ];
                                colorCodeConfigTemp[
                                  colorConfigIndex
                                ].clauses.splice(clauseIndex, 1);
                                setColorCodeConfig(colorCodeConfigTemp);
                              }}
                            >
                              <TbX size='1.5rem' />
                            </ActionIcon>
                          </Center>
                        </Table.Td>

                        <Table.Td>
                          <Select
                            data={[
                              'DailyNote',
                              {
                                group: t(
                                  'calendarPage.colorCodeFilter.modal.tElementAttributeDivider'
                                ),
                                items: allAttributeNames,
                              },
                            ]}
                            value={clause.element}
                            onChange={(e) => {
                              const configTemp = [...colorCodeConfig];
                              configTemp[colorConfigIndex].clauses[
                                clauseIndex
                              ].element = e ?? '';
                              setColorCodeConfig(configTemp);
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
                              const configTemp = [...colorCodeConfig];
                              configTemp[colorConfigIndex].clauses[
                                clauseIndex
                              ].operator = (e as FilterOperators) ?? '';
                              setColorCodeConfig(configTemp);
                            }}
                          />
                        </Table.Td>
                        <Table.Td>
                          <TextInput
                            disabled={clause.operator === 'is empty'}
                            value={clause.value}
                            onChange={(e) => {
                              const configTemp = [...colorCodeConfig];
                              configTemp[colorConfigIndex].clauses[
                                clauseIndex
                              ].value = e.target.value;
                              setColorCodeConfig(configTemp);
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
                        const colorCodeConfigTemp = [...colorCodeConfig];
                        colorCodeConfigObj.clauses.push({
                          element: '',
                          operator: '',
                          value: '',
                        });
                        setColorCodeConfig(colorCodeConfigTemp);
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
                disabled={colorCodeConfigObj.clauses.length <= 1}
                label={t(
                  'calendarPage.colorCodeFilter.modal.logicalConnectiveSelect'
                )}
                data={['AND', 'OR', 'XOR']}
                value={colorCodeConfigObj.logicGate}
                defaultValue={'AND'}
                onChange={(e) => {
                  const configTemp = [...colorCodeConfig];
                  configTemp[colorConfigIndex].logicGate =
                    (e as LogicGate) ?? '';
                  setColorCodeConfig(configTemp);
                }}
              />

              <ColorInput
                label={t('calendarPage.colorCodeFilter.modal.colorInputLabel')}
                format='hex'
                swatches={[
                  '#2e2e2e',
                  '#868e96',
                  '#fa5252',
                  '#e64980',
                  '#be4bdb',
                  '#7950f2',
                  '#4c6ef5',
                  '#228be6',
                  '#15aabf',
                  '#12b886',
                  '#40c057',
                  '#82c91e',
                  '#fab005',
                  '#fd7e14',
                ]}
                value={colorCodeConfigObj.colorHex}
                onChange={(e) => {
                  const configTemp = [...colorCodeConfig];
                  configTemp[colorConfigIndex].colorHex = e;
                  setColorCodeConfig(configTemp);
                }}
              />
            </Group>
          </Paper>
        );
      })}

      <Space h='sm' />

      <Button onClick={saveColorCoding}>
        {t('calendarPage.colorCodeFilter.modal.save')}
      </Button>

      <Button
        ml={10}
        variant='default'
        onClick={() => {
          const colorCodeConfigTemp = [...colorCodeConfig];
          colorCodeConfigTemp.push({
            logicGate: 'AND',
            clauses: [
              {
                element: '',
                operator: '',
                value: '',
              },
            ],
            colorHex: '',
          });
          setColorCodeConfig(colorCodeConfigTemp);
        }}
      >
        {t('calendarPage.colorCodeFilter.modal.addGroup')}
      </Button>

      <Button
        style={{ float: 'right' }}
        variant='subtle'
        color='red'
        onClick={() => {
          setColorCodeConfig(defaultConfig);
          props.onReset();
          props.onClose();
        }}
      >
        {t('calendarPage.colorCodeFilter.modal.reset')}
      </Button>
    </Modal>
  );
}

export default ColorCodeModal;
