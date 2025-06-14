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
  title: string;
  startDate: Date;
  endDate: Date;
  attributesVisualizations: AttributeVisualization[];
  colorCodeConfig?: ColorCodeConfiguration;
  includeMedicationList: boolean;
  additionalNotes?: string;
};

export type { VisualizationType, AttributeVisualization, HealthReport };
