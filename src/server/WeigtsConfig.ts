export interface IWinWeight {
  credit: number;
  id: number;
  weight: number;
}

export const WIN_WEIGHTS: Array<IWinWeight> = [
  { id: 0, credit: 5000, weight: 4 },
  { id: 1, credit: 200, weight: 100 },
  { id: 2, credit: 1000, weight: 20 },
  { id: 3, credit: 400, weight: 50 },
  { id: 4, credit: 2000, weight: 10 },
  { id: 5, credit: 200, weight: 100 },
  { id: 6, credit: 1000, weight: 20 },
  { id: 7, credit: 400, weight: 50 },
];
