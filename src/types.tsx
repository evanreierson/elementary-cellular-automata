export type Cell = 1 | 0;

export type Pattern =
  | 0b111
  | 0b110
  | 0b101
  | 0b100
  | 0b011
  | 0b010
  | 0b001
  | 0b000;
export type Rule = {
  [P in Pattern]: Cell;
};
