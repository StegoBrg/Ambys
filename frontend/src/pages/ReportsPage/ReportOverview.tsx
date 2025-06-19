import { useEffect, useState } from 'react';
import { HealthReport, HealthReportStringDates } from './Types';
import axiosInstance from '../../lib/axiosInstance';
import { Button, Center, Stack, Title } from '@mantine/core';

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
        console.log(response.data);
      });
  }, []);

  return (
    <>
      <Center mt={20}>
        <Stack gap='xl'>
          {allReportConfigs.map((value, index) => (
            <Button
              key={index}
              variant='outline'
              size='xl'
              radius='lg'
              onClick={() => {
                const report: HealthReport = {
                  id: value.id,
                  name: value.name,
                  folder: value.folder,
                  startDate: new Date(value.startDate),
                  endDate: new Date(value.endDate),
                  attributesVisualizations: value.attributesVisualizations,
                  colorCodeConfig: value.colorCodeConfig,
                  includeMedicationList: value.includeMedicationList,
                  additionalNotes: value.additionalNotes,
                };

                props.onClick(report);
              }}
            >
              <Stack>
                <div>{value.name}</div>
                <Title order={6}>
                  {value.startDate} - {value.endDate}
                </Title>
              </Stack>
            </Button>
          ))}
        </Stack>
      </Center>
    </>
  );
}

export default ReportOverview;
