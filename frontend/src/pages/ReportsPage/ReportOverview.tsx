import { useEffect, useState } from 'react';
import { HealthReport } from './Types';
import axiosInstance from '../../lib/axiosInstance';
import {
  Card,
  Center,
  Group,
  Stack,
  Title,
  Text,
  NavLink,
} from '@mantine/core';
import { TbFolder } from 'react-icons/tb';

interface Props {
  onClick: (report: HealthReport) => void;
}

interface FolderNode {
  folders: Record<string, FolderNode>;
  reports: HealthReport[];
}

interface FolderViewProps {
  tree: Record<string, FolderNode>;
  onReportClick: (report: HealthReport) => void;
}

function FolderView(props: FolderViewProps) {
  return (
    <>
      <Stack w='100%' maw={600} gap={'xs'}>
        {Object.entries(props.tree).map(
          ([folderName, { folders, reports }]) => (
            <NavLink
              label={<Title order={4}>{folderName}</Title>}
              leftSection={<TbFolder size={20} />}
              mt={10}
              key={folderName}
            >
              {/* Render reports */}
              <Stack>
                {reports.map((reportConfig) => (
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
                        startDate: reportConfig.startDate,
                        endDate: reportConfig.endDate,
                        attributesVisualizations:
                          reportConfig.attributesVisualizations,
                        colorCodeConfig: reportConfig.colorCodeConfig,
                        includeMedicationList:
                          reportConfig.includeMedicationList,
                        additionalNotes: reportConfig.additionalNotes,
                      };

                      props.onReportClick(report);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <Group>
                      <Text fw={500}>{reportConfig.name}</Text>
                      <Text size='sm' c='dimmed'>
                        {new Date(reportConfig.startDate).toLocaleDateString()}{' '}
                        ➤ {new Date(reportConfig.endDate).toLocaleDateString()}
                      </Text>
                    </Group>
                  </Card>
                ))}
              </Stack>

              {/* Render subfolders recursively */}
              <FolderView tree={folders} onReportClick={props.onReportClick} />
            </NavLink>
          )
        )}
      </Stack>
    </>
  );
}

function ReportOverview(props: Props) {
  const [allReportConfigs, setAllReportsConfigs] = useState<HealthReport[]>([]);

  useEffect(() => {
    axiosInstance
      .get<HealthReport[]>('HealthReportConfigs')
      .then((response) => {
        setAllReportsConfigs(response.data);
      });
  }, []);

  const root: Record<string, FolderNode> = {};
  allReportConfigs.forEach((report) => {
    const allFolders = report.folder.split('/');
    let currentLevel = root;

    allFolders.forEach((folder, index) => {
      if (!currentLevel[folder]) {
        currentLevel[folder] = {
          folders: {},
          reports: [],
        };
      }

      if (index === allFolders.length - 1) {
        currentLevel[folder].reports.push(report);
      } else {
        currentLevel = currentLevel[folder].folders;
      }
    });
  });

  return (
    <>
      <Center mt={20}>
        <FolderView tree={root} onReportClick={props.onClick} />
      </Center>
    </>
  );
}

export default ReportOverview;
