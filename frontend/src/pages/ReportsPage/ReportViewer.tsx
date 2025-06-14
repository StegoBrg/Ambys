import { useEffect, useState } from 'react';
import { DailyNote, DiaryFilterConfiguration } from '../../Types';
import axiosInstance from '../../lib/axiosInstance';
import { Box } from '@mantine/core';
import { LineChart } from '@mantine/charts';

import {
  getAttributeAggregate,
  getAttributeAverage,
  getAttributeMax,
  getAttributeMin,
  getAttributeShowAll,
  getAttributeShowAllWithFilter,
  getAttributeSum,
} from './VisualizationFunctions';

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
  visualizationType: VisualizationTypes;
  filter?: DiaryFilterConfiguration;
};

function ReportViewer() {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const [startDate] = useState<Date>(oneMonthAgo);
  const [endDate] = useState<Date>(new Date());

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

  const testFilterConfig: DiaryFilterConfiguration = {
    logicGate: 'AND',
    clauses: [
      {
        element: 'Wellbeing',
        operator: '>',
        value: '8',
      },
      {
        element: 'Wellbeing',
        operator: '<',
        value: '10',
      },
    ],
  };
  console.log(
    getAttributeShowAllWithFilter('Wellbeing', dailyNotes, testFilterConfig)
  );

  const attributesVisualizations: AttributeVisualization[] = [
    {
      attributeName: 'Wellbeing',
      visualizationType: 'lineChart',
    },
    {
      attributeName: 'Wellbeing',
      visualizationType: 'average',
    },
    {
      attributeName: 'Wellbeing',
      visualizationType: 'min',
    },
    {
      attributeName: 'Wellbeing',
      visualizationType: 'max',
    },
    {
      attributeName: 'Wellbeing',
      visualizationType: 'sum',
    },
    {
      attributeName: 'Wellbeing',
      visualizationType: 'aggregate',
    },
    {
      attributeName: 'Unable to work?',
      visualizationType: 'aggregate',
    },
    {
      attributeName: 'Notes',
      visualizationType: 'showAll',
    },
    {
      attributeName: 'CRP',
      visualizationType: 'showAll',
    },
    {
      attributeName: 'Wellbeing',
      visualizationType: 'showAllWithFilter',
      filter: testFilterConfig,
    },
  ];

  return (
    <div>
      <h1>Report Viewer</h1>
      <p>Daily Notes Count: {dailyNotes.length}</p>
      {attributesVisualizations.map((av, index) => {
        switch (av.visualizationType) {
          case 'sum': {
            const sum = getAttributeSum(av.attributeName, dailyNotes);
            return (
              <Box key={index}>
                <h2>{av.attributeName} - Sum</h2>
                <p>{sum}</p>
              </Box>
            );
          }
          case 'min': {
            const min = getAttributeMin(av.attributeName, dailyNotes);
            console.log('Min:', min);

            if (!min) {
              return (
                <Box key={index}>
                  <h2>{av.attributeName} - Min</h2>
                  <p>No valid values found</p>
                </Box>
              );
            }
            return (
              <Box key={index}>
                <h2>{av.attributeName} - Min</h2>
                <p>
                  {min.date.toDateString()} - {min.value}
                </p>
              </Box>
            );
          }
          case 'max': {
            const max = getAttributeMax(av.attributeName, dailyNotes);
            console.log('Max:', max);

            if (!max) {
              return (
                <Box key={index}>
                  <h2>{av.attributeName} - Max</h2>
                  <p>No valid values found</p>
                </Box>
              );
            }
            return (
              <Box key={index}>
                <h2>{av.attributeName} - Max</h2>
                <p>
                  {max.date.toDateString()} - {max.value}
                </p>
              </Box>
            );
          }
          case 'average': {
            const average = getAttributeAverage(av.attributeName, dailyNotes);
            console.log('Average:', average);

            if (!average) {
              return (
                <Box key={index}>
                  <h2>{av.attributeName} - Average</h2>
                  <p>No valid values found</p>
                </Box>
              );
            }
            return (
              <Box key={index}>
                <h2>{av.attributeName} - Average</h2>
                <p>{average}</p>
              </Box>
            );
          }
          case 'aggregate': {
            const aggregate = getAttributeAggregate(
              av.attributeName,
              dailyNotes
            );
            console.log('Aggregate:', aggregate);

            if (!aggregate) {
              return (
                <Box key={index}>
                  <h2>{av.attributeName} - Aggregate</h2>
                  <p>No valid values found</p>
                </Box>
              );
            }
            return (
              <Box key={index}>
                <h2>{av.attributeName} - Aggregate</h2>
                {aggregate.map((item, idx) => (
                  <p key={idx}>
                    {item.value} - {item.count}
                  </p>
                ))}
              </Box>
            );
          }
          case 'lineChart': {
            // Get all notes with the specified attribute
            const allAttributes = getAttributeShowAll(
              av.attributeName,
              dailyNotes
            );
            console.log('Line Chart Data:', allAttributes);

            // Convert the data to the format required by LineChart
            const allAttributesStringDates = allAttributes.map((item) => {
              return {
                date: item.date.toISOString().split('T')[0], // Convert to string date format
                value: item.value,
              };
            });

            return (
              <>
                <Box key={index}>
                  <h2>{av.attributeName} - Line Chart</h2>
                </Box>
                <LineChart
                  h={300}
                  data={allAttributesStringDates}
                  dataKey='date'
                  series={[{ name: 'value', color: 'indigo.6' }]}
                  curveType='linear'
                />
              </>
            );
          }
          case 'showAll': {
            const allAttributes = getAttributeShowAll(
              av.attributeName,
              dailyNotes
            );
            console.log('Show All:', allAttributes);

            if (!allAttributes) {
              return (
                <Box key={index}>
                  <h2>{av.attributeName} - Show All</h2>
                  <p>No valid values found</p>
                </Box>
              );
            }
            return (
              <Box key={index}>
                <h2>{av.attributeName} - Show All</h2>
                {allAttributes.map((item, idx) => (
                  <p key={idx}>
                    {item.date.toDateString()} - {item.value}
                  </p>
                ))}
              </Box>
            );
          }
          case 'showAllWithFilter': {
            const allAttributesWithFilter = getAttributeShowAllWithFilter(
              av.attributeName,
              dailyNotes,
              av.filter as DiaryFilterConfiguration
            );
            console.log('Show All with Filter:', allAttributesWithFilter);

            if (!allAttributesWithFilter) {
              return (
                <Box key={index}>
                  <h2>{av.attributeName} - Show All with Filter</h2>
                  <p>No valid values found</p>
                </Box>
              );
            }
            return (
              <Box key={index}>
                <h2>{av.attributeName} - Show All with Filter</h2>
                <p>
                  <strong>Filter:</strong>{' '}
                  {av.filter
                    ? av.filter.clauses
                        .map(
                          (clause) =>
                            `${clause.element} ${clause.operator} ${clause.value}`
                        )
                        .join(` ${av.filter.logicGate} `)
                    : 'None'}
                </p>
                {allAttributesWithFilter.map((item, idx) => (
                  <p key={idx}>
                    {item.date.toDateString()} - {item.value}
                  </p>
                ))}
              </Box>
            );
          }
          default: {
            console.error('Unknown visualization type:', av.visualizationType);
            return <></>;
          }
        }
      })}
    </div>
  );
}

export default ReportViewer;
