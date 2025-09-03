// Returns hex code of color according of color coding filter.

import { ColorCodeConfiguration, DailyNote } from '../../Types';

// Returns undefined if no filter could be found for the given date.
function getColorCodingForDate(
  dateString: string,
  colorCodeConfig: ColorCodeConfiguration | undefined,
  dailyNotes: DailyNote[]
): string | undefined {
  const dailyNote = getDailyNoteForDate(dateString, dailyNotes);

  const config = colorCodeConfig;

  if (config === undefined) return undefined;

  for (let configGroup = 0; configGroup < config.length; configGroup++) {
    let filterApply = false; // Tracks whether a filter from the localStorage could be applied.
    const filterApplyClauses: boolean[] = []; // Checks if the filter applies for each clause alone. These will get combined with AND / OR setting.

    for (let i = 0; i < config[configGroup].clauses.length; i++) {
      const clause = config[configGroup].clauses[i];

      filterApplyClauses[i] = false;

      if (dailyNote === undefined) {
        // Check if nonexistant dailyNote should be color coded.
        if (clause.element === 'DailyNote' && clause.operator === 'is empty') {
          filterApplyClauses[i] = true;
        }
      } else {
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
      }
    }

    // Check if all inner clauses fit together regarding logic gate.
    const logicGate = config[configGroup].logicGate;

    if (logicGate === 'AND') {
      filterApply = filterApplyClauses.every(Boolean);
    } else if (logicGate === 'OR') {
      filterApply = filterApplyClauses.some(Boolean);
    } else if (logicGate === 'XOR') {
      filterApply = filterApplyClauses.filter(Boolean).length === 1;
    }

    if (filterApply) {
      return config[configGroup].colorHex;
    }
  }

  // Return undefined if no color code filter could be applied.
  return undefined;
}

function getDailyNoteForDate(dateString: string, dailyNotes: DailyNote[]) {
  const dailyNote = dailyNotes.find((x) => x.date === dateString);

  return dailyNote;
}

export { getColorCodingForDate, getDailyNoteForDate };
