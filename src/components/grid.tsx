import React from "react";

/////////////
// HELPERS //
/////////////

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

function getBit(decimal: number, position: number) {
  return (decimal & (1 << position)) === 0 ? 0 : 1;
}

///////////
// TYPES //
///////////

type Cell = 1 | 0;
type Pattern = 0b111 | 0b110 | 0b101 | 0b100 | 0b011 | 0b010 | 0b001 | 0b000;
type Rule = {
  [P in Pattern]: Cell;
};

///////////
// Views //
///////////

const ViewCell = ({ alive }: { alive: Cell }) => {
  if (alive) {
    return (
      <div className="w-4 h-4 rounded-full shadow-md bg-green-600 flex-shrink-0"></div>
    );
  } else {
    return (
      <div className="w-4 h-4 rounded-full shadow-inner bg-gray-400 flex-shrink-0"></div>
    );
  }
};

const ViewRow = ({ row }: { row: Cell[] }) => {
  return (
    <div className="flex flex-row">
      {row.map((cell: Cell) => {
        return <ViewCell alive={cell} />;
      })}
    </div>
  );
};

export const ViewGrid = () => {
  const generateRule = (decimal: number): Rule => {
    const rule: Rule = {
      0b111: getBit(decimal, 7),
      0b110: getBit(decimal, 6),
      0b101: getBit(decimal, 5),
      0b100: getBit(decimal, 4),
      0b011: getBit(decimal, 3),
      0b010: getBit(decimal, 2),
      0b001: getBit(decimal, 1),
      0b000: getBit(decimal, 0)
    };
    return rule;
  };

  const nextRow = (currentRow: Cell[], rule: Rule): Cell[] => {
    let next: Cell[] = [];
    for (let i = 0; i < currentRow.length; i++) {
      let p: Pattern = 0b000;

      p |= currentRow[mod(i - 1, currentRow.length)] << 2;
      p |= currentRow[mod(i, currentRow.length)] << 1;
      p |= currentRow[mod(i + 1, currentRow.length)];

      next.push(rule[p as Pattern]); // wtf?
    }
    return next;
  };

  const randomFirstRow = (columns: number, density = 0.5): Cell[] => {
    let first_row: Cell[] = [];
    for (let i = 0; i < columns; i++) {
      if (Math.random() < density) {
        first_row.push(1);
      } else {
        first_row.push(0);
      }
    }
    return first_row;
  };

  const generateRows = (
    rows: number,
    initial: Cell[],
    rule: Rule
  ): Cell[][] => {
    let all_rows = [initial];
    for (let i = 0; i < rows; i++) {
      let previous_row = all_rows[all_rows.length - 1];
      all_rows.push(nextRow(previous_row, rule));
    }
    return all_rows;
  };

  return (
    <div className="overflow-x-auto">
      {generateRows(100, randomFirstRow(150, 0.1), generateRule(150)).map(
        (row: Cell[]) => {
          return <ViewRow row={row} />;
        }
      )}
    </div>
  );
};
