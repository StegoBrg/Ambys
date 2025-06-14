import { DailyNote, DiaryFilterConfiguration } from '../../Types';

type VisualizationResult = {
  date: Date;
  value: number | string | boolean;
};

function getAttributeSum(
  attributeName: string,
  dailyNotes: DailyNote[]
): number {
  return dailyNotes.reduce((sum, note) => {
    const attribute = note.attributes.find(
      (attr) => attr.name === attributeName
    );
    return sum + (attribute ? parseFloat(attribute.value) || 0 : 0);
  }, 0);
}

function getAttributeMin(
  attributeName: string,
  dailyNotes: DailyNote[]
): VisualizationResult | null {
  let lowestValue = Infinity;
  let lowestValueDate: Date | null = null;
  dailyNotes.forEach((element) => {
    const attribute = element.attributes.find(
      (attr) => attr.name === attributeName
    );
    if (attribute) {
      const value = parseFloat(attribute.value);
      if (!isNaN(value)) {
        // Process the value as needed
        if (value < lowestValue) {
          lowestValue = value;
          lowestValueDate = new Date(element.date);
        }
      }
    }
  });
  if (lowestValue === Infinity || lowestValueDate === null) {
    return null; // No valid values found
  }
  return {
    date: lowestValueDate,
    value: lowestValue,
  };
}

function getAttributeMax(
  attributeName: string,
  dailyNotes: DailyNote[]
): VisualizationResult | null {
  let highestValue = -Infinity;
  let highestValueDate: Date | null = null;
  dailyNotes.forEach((element) => {
    const attribute = element.attributes.find(
      (attr) => attr.name === attributeName
    );
    if (attribute) {
      const value = parseFloat(attribute.value);
      if (!isNaN(value)) {
        // Process the value as needed
        if (value > highestValue) {
          highestValue = value;
          highestValueDate = new Date(element.date);
        }
      }
    }
  });
  if (highestValue === -Infinity || highestValueDate === null) {
    return null; // No valid values found
  }
  return {
    date: highestValueDate,
    value: highestValue,
  };
}

function getAttributeAverage(
  attributeName: string,
  dailyNotes: DailyNote[]
): number | null {
  let total = 0;
  let count = 0;

  dailyNotes.forEach((element) => {
    const attribute = element.attributes.find(
      (attr) => attr.name === attributeName
    );
    if (attribute) {
      const value = parseFloat(attribute.value);
      if (!isNaN(value)) {
        total += value;
        count++;
      }
    }
  });

  return count > 0 ? total / count : null;
}

function getAttributeAggregate(
  attributeName: string,
  dailyNotes: DailyNote[]
): { value: string; count: number }[] {
  const aggregate: { [key: string]: number } = {};

  dailyNotes.forEach((element) => {
    const attribute = element.attributes.find(
      (attr) => attr.name === attributeName
    );
    if (attribute) {
      const value = attribute.value;
      // Only count non-empty values
      if (value === '') return;
      if (aggregate[value] === undefined) {
        aggregate[value] = 1;
      } else {
        aggregate[value]++;
      }
    }
  });

  return Object.entries(aggregate).map(([value, count]) => ({
    value,
    count,
  }));
}

function getAttributeShowAll(
  attributeName: string,
  dailyNotes: DailyNote[]
): VisualizationResult[] {
  const allNotes: VisualizationResult[] = [];

  dailyNotes.forEach((note) => {
    const attribute = note.attributes.find(
      (attr) => attr.name === attributeName
    );
    if (attribute !== undefined && attribute.value !== '') {
      // Only include notes that have the specified attribute with a non-empty value
      allNotes.push({
        date: new Date(note.date),
        value: attribute.value,
      });
    }
  });

  return allNotes;
}

function getAttributeShowAllWithFilter(
  attributeName: string,
  dailyNotes: DailyNote[],
  filterConfig: DiaryFilterConfiguration
): VisualizationResult[] {
  const filteredDailyNotes: VisualizationResult[] = [];

  dailyNotes.forEach((dailyNote) => {
    if (filterConfig === undefined) return true;

    let filterApply = false; // Tracks whether a filter from the localStorage could be applied.
    const filterApplyClauses: boolean[] = []; // Checks if the filter applies for each clause alone. These will get combined with AND / OR setting.

    for (let i = 0; i < filterConfig.clauses.length; i++) {
      const clause = filterConfig.clauses[i];

      filterApplyClauses[i] = false;

      if (dailyNote === undefined) return true;

      // Check all attributes of dailyNote and check if filter apply.
      for (let j = 0; j < dailyNote.attributes.length; j++) {
        const attribute = dailyNote.attributes[j];

        if (clause.element === attribute.name) {
          switch (clause.operator) {
            case '=':
              if (attribute.value === clause.value)
                filterApplyClauses[i] = true;
              break;
            case '<':
              if (+attribute.value < +clause.value)
                filterApplyClauses[i] = true;
              break;
            case '<=':
              if (+attribute.value <= +clause.value)
                filterApplyClauses[i] = true;
              break;
            case '>':
              if (+attribute.value > +clause.value)
                filterApplyClauses[i] = true;
              break;
            case '>=':
              if (+attribute.value >= +clause.value)
                filterApplyClauses[i] = true;
              break;
            case 'contains':
              if (attribute.value.includes(clause.value))
                filterApplyClauses[i] = true;
              break;
            case 'is empty':
              if (attribute.value === '') filterApplyClauses[i] = true;
              break;
          }
        }
      }

      // Check if all inner clauses fit together regarding logic gate.
      const logicGate = filterConfig.logicGate;

      if (logicGate === 'AND') {
        filterApply = filterApplyClauses.every(Boolean);
      } else if (logicGate === 'OR') {
        filterApply = filterApplyClauses.some(Boolean);
      } else if (logicGate === 'XOR') {
        filterApply = filterApplyClauses.filter(Boolean).length === 1;
      }
    }

    const attribute = dailyNote.attributes.find(
      (attr) => attr.name === attributeName
    );

    if (filterApply && attribute) {
      filteredDailyNotes.push({
        date: new Date(dailyNote.date),
        value: attribute.value,
      });
    }
  });

  return filteredDailyNotes;
}

export type { VisualizationResult };
export {
  getAttributeSum,
  getAttributeMin,
  getAttributeMax,
  getAttributeAverage,
  getAttributeAggregate,
  getAttributeShowAll,
  getAttributeShowAllWithFilter,
};
