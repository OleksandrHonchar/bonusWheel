import { getTotalWeight, SelectedWeight, selectWeight } from "./WeightSelector";

describe("Weight Selector", () => {
  const weights = [
    { id: 0, credit: 5000, weight: 30 },
    { id: 1, credit: 200, weight: 50 },
    { id: 2, credit: 1000, weight: 10 },
    { id: 3, credit: 400, weight: 5 },
    { id: 4, credit: 2000, weight: 3 },
    { id: 5, credit: 200, weight: 2 },
  ];

  describe("wins selecting based on weights ", function () {
    it("probabilities should be close enough to", function () {
      const totalWeight = getTotalWeight(weights);
      const results = {} as any;
      const numberOfTries = 100000000;
      let tries = numberOfTries;

      while (tries-- > 0) {
        const { id } = selectWeight(weights, totalWeight) as SelectedWeight;
        if (!results[id]) {
          results[id] = 0;
        }
        results[id]++;
      }

      for (let i = 0; i < weights.length; i++) {
        const winProbability = weights[i].weight / totalWeight;
        //4 numbers after decimal
        console.log(
          `Weight with: ${weights[i].credit} was selected ${
            results[i]
          } times, which is: ${(results[i] / numberOfTries) * 100} %`
        );
        expect(results[i] / numberOfTries).toBeCloseTo(winProbability, 3);
      }
    });
  });
});
