import { useEffect, useState } from 'react';
import { DailyNote, DiaryFilterConfiguration } from '../../Types';
import axiosInstance from '../../lib/axiosInstance';
import { Box } from '@mantine/core';

type VisualizationTypes =
  | 'sum'
  | 'min'
  | 'max'
  | 'average'
  | 'aggregate'
  | 'lineChart'
  | 'showAll'
  | 'showAllWithFilter';

type AttributeVisualization = {
  attributeName: string;
  visualizationType: string;
  filter?: DiaryFilterConfiguration;
};

function ReportViewer() {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const [startDate, setStartDate] = useState<Date>(oneMonthAgo);
  const [endDate, setEndDate] = useState<Date>(new Date());

  const attributesVisualizations: AttributeVisualization[] = [
    {
      attributeName: 'Wellbeing',
      visualizationType: 'average',
    },
  ];

  const [dailyNotes, setDailyNotes] = useState<DailyNote[]>([]);

  useEffect(() => {
    axiosInstance
      .get<DailyNote[]>(
        `dailynotes?startDate=${
          startDate.toISOString().split('T')[0]
        }&endDate=${endDate.toISOString().split('T')[0]}`
      )
      .then((response) => {
        setDailyNotes(response.data);
        console.log('Daily Notes:', response.data);
      });
  }, [endDate, startDate]);

  function getAttributeSum(attributeName: string) {
    return dailyNotes.reduce((sum, note) => {
      const attribute = note.attributes.find(
        (attr) => attr.name === attributeName
      );
      return sum + (attribute ? parseFloat(attribute.value) || 0 : 0);
    }, 0);
  }

  return (
    <div>
      <h1>Report Viewer</h1>
      {attributesVisualizations.map((av, index) => (
        <>
          <Box key={index}>{getAttributeSum(av.attributeName)}</Box>
        </>
      ))}
    </div>
  );
}

export default ReportViewer;
