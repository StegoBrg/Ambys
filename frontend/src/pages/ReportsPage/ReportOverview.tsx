import { useEffect, useState } from 'react';
import { HealthReport } from './Types';
import axiosInstance from '../../lib/axiosInstance';
import { Button } from '@mantine/core';

function ReportOverview() {
  const [allReportConfigs, setAllReportsConfigs] = useState<HealthReport[]>([]);

  useEffect(() => {
    axiosInstance.get<HealthReport[]>('HealthReportConfig').then((response) => {
      setAllReportsConfigs(response.data);
      console.log(response.data);
    });
  }, []);

  return (
    <>
      {allReportConfigs.map((value, index) => (
        <Button key={index}>{value.name}</Button>
      ))}
    </>
  );
}

export default ReportOverview;
