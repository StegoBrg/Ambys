import { useEffect, useState } from 'react';
import { HealthReport, HealthReportStringDates } from './Types';
import axiosInstance from '../../lib/axiosInstance';
import {
  Card,
  Center,
  Group,
  Stack,
  Title,
  Text,
  Box,
  NavLink,
} from '@mantine/core';
import { TbFolder } from 'react-icons/tb';

interface Props {
  onClick: (report: HealthReport) => void;
}

function ReportOverview(props: Props) {
  const [allReportConfigs, setAllReportsConfigs] = useState<
    HealthReportStringDates[]
  >([]);

  useEffect(() => {
    axiosInstance
      .get<HealthReportStringDates[]>('HealthReportConfigs')
      .then((response) => {
        setAllReportsConfigs(response.data);
      });
  }, []);

  const folders = allReportConfigs.reduce<
    Record<string, HealthReportStringDates[]>
  >((acc, report) => {
    acc[report.folder] = acc[report.folder] || [];
    acc[report.folder].push(report);
    return acc;
  }, {});

  console.log('Folders:', folders);

  return (
    <>
      <Center mt={20}>
        <Stack w='100%' maw={600}>
          {Object.entries(folders).map(([folderName, folderReports]) => (
            <Box key={folderName}>
              <NavLink
                label={<Title order={4}>{folderName}</Title>}
                leftSection={<TbFolder size={20} />}
                mb={10}
              >
                <Stack>
                  {folderReports.map((reportConfig) => (
                    <Card
                      w='100%'
                      key={reportConfig.id}
                      withBorder
                      shadow='sm'
                      padding='md'
                      onClick={() => {
                        const report: HealthReport = {
                          id: reportConfig.id,
                          name: reportConfig.name,
                          folder: reportConfig.folder,
                          startDate: new Date(reportConfig.startDate),
                          endDate: new Date(reportConfig.endDate),
                          attributesVisualizations:
                            reportConfig.attributesVisualizations,
                          colorCodeConfig: reportConfig.colorCodeConfig,
                          includeMedicationList:
                            reportConfig.includeMedicationList,
                          additionalNotes: reportConfig.additionalNotes,
                        };

                        props.onClick(report);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <Group>
                        <Text fw={500}>{reportConfig.name}</Text>
                        <Text size='sm' c='dimmed'>
                          {reportConfig.startDate} → {reportConfig.endDate}
                        </Text>
                      </Group>
                    </Card>
                  ))}
                </Stack>
              </NavLink>
            </Box>
          ))}
        </Stack>
      </Center>
    </>
  );
}

export default ReportOverview;
