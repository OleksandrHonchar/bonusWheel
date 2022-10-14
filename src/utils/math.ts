export const getValueFromRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min) * 100) / 100 + min;
};

export const formatCredit = (value: number): string => {
  return value.toFixed(2);
};
