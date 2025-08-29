type Clause = {
  element: string;
  operator: string;
  value: string;
};

type ColorFilter = {
  logicGate: string;
  clauses: Clause[];
  colorHex: string;
};

type LegendProps = {
  filters: ColorFilter[];
};

function ColorLegend({ filters }: LegendProps) {
  return (
    <div>
      <h3>Applied Color Filters</h3>

      {filters.map((filter, index) => (
        <li
          key={index}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginBottom: 8,
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              backgroundColor: filter.colorHex,
              borderRadius: 4,
              marginRight: 8,
            }}
          />
          <span>
            {filter.clauses
              .map(
                (clause) =>
                  `${clause.element} ${clause.operator}${
                    clause.value ? ` ${clause.value}` : ''
                  }`
              )
              .join(` ${filter.logicGate} `)}
          </span>
        </li>
      ))}
    </div>
  );
}

export default ColorLegend;
