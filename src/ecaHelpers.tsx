import { Rule, Cell, Pattern } from "./types";

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

function getBit(decimal: number, position: number) {
  return (decimal & (1 << position)) === 0 ? 0 : 1;
}

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

export const nextRow = (currentRow: Cell[], rule: number): Cell[] => {
  let next: Cell[] = [];
  let generatedRule = generateRule(rule);
  for (let i = 0; i < currentRow.length; i++) {
    let p: Pattern = 0b000;

    p |= currentRow[mod(i - 1, currentRow.length)] << 2;
    p |= currentRow[mod(i, currentRow.length)] << 1;
    p |= currentRow[mod(i + 1, currentRow.length)];

    next.push(generatedRule[p as Pattern]); // wtf?
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

export const generateRows = (
  size: number,
  density: number,
  ruleNumber: number
): Cell[][] => {
  let all_rows = [randomFirstRow(size, density)];
  for (let i = 0; i < size - 1; i++) {
    let previous_row = all_rows[all_rows.length - 1];
    all_rows.push(nextRow(previous_row, ruleNumber));
  }
  return all_rows;
};
