import { IWinWeight } from "./WeigtsConfig";

export interface SelectedWeight {
  id: number;
  weight: IWinWeight;
}

export type SelectWinCallback = () => SelectedWeight | unknown;

export const selectWeight = (
  winWeights: Array<IWinWeight>,
  totalWeight: number
): SelectedWeight | unknown => {
  const random = Math.random();

  let probability = 0;

  for (let i = 0; i < winWeights.length; i++) {
    const weight = winWeights[i];

    probability += weight.weight / totalWeight;

    if (random <= probability) {
      return {
        id: weight.id,
        weight,
      };
    }
  }
  throw Error("Something went wrong while selecting a win");
};

const checkDebug = (): number | null => {
  const debugSelector = document.getElementById(
    "win-select"
  ) as HTMLSelectElement;

  const selected = debugSelector.selectedOptions[0].value;
  const availableOptions = ["0", "1", "2", "3", "4", "5", "6", "7"];

  if (availableOptions.includes(selected)) {
    return Number(selected);
  }
  return null;
};

export const getTotalWeight = (weights: Array<IWinWeight>) =>
  weights.reduce((previous, current) => previous + current.weight, 0);

export const getWinCallback = (
  weights: Array<IWinWeight>
): SelectWinCallback => {
  const totalWeight = getTotalWeight(weights);

  return () => {
    const debugId = checkDebug();

    if (debugId === null) {
      const { weight } = selectWeight(weights, totalWeight) as SelectedWeight;
      return {
        id: weight.id,
        credit: weight.credit,
      };
    }

    return {
      id: debugId,
      credit: weights[debugId].credit,
    };
  };
};
