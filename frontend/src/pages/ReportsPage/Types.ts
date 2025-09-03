import { ColorCodeConfiguration, DiaryFilterConfiguration } from '../../Types';

type VisualizationType =
  | 'sum'
  | 'min'
  | 'max'
  | 'average'
  | 'aggregate'
  | 'lineChart'
  | 'showAll'
  | 'showAllWithFilter'
  | '';

type AttributeVisualization = {
  attributeName: string;
  visualizationType: VisualizationType;
  filter?: DiaryFilterConfiguration;
};

type HealthReport = {
  id?: number;
  name: string;
  folder: string;
  startDate: string;
  endDate: string;
  attributesVisualizations: AttributeVisualization[];
  colorCodeConfig?: ColorCodeConfiguration;
  includeMedicationList: boolean;
  additionalNotes?: string;
};

export type {
  VisualizationType,
  AttributeVisualization,
  HealthReport,
};
