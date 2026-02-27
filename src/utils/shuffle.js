/**
 * Fisher-Yates shuffle - shuffles array in place
 * @param {Array} array - Array to shuffle (mutates in place)
 * @returns {Array} - Shuffled array
 */
export function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * LaneSequence - ensures each lane appears exactly once before reshuffling
 * Uses Fisher-Yates shuffle for fair short-term distribution
 */
export class LaneSequence {
  constructor(laneCount = 3) {
    this.laneCount = laneCount;
    this.sequence = [];
    this.index = 0;
    this.shuffle();
  }

  shuffle() {
    this.sequence = [...Array(this.laneCount).keys()]; // [0, 1, 2, ...]
    shuffle(this.sequence);
    this.index = 0;
  }

  getNext() {
    const lane = this.sequence[this.index];
    this.index++;
    if (this.index >= this.sequence.length) {
      this.shuffle();
    }
    return lane;
  }

  reset() {
    this.index = 0;
    this.shuffle();
  }
}

/**
 * Weighted picker - picks item based on weights
 * @param {Array} items - Items array
 * @param {Array} weights - Corresponding weights (integers)
 * @returns {*} - Selected item
 */
export function weightedPick(items, weights) {
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let rand = Math.random() * totalWeight;
  
  for (let i = 0; i < items.length; i++) {
    rand -= weights[i];
    if (rand <= 0) {
      return items[i];
    }
  }
  return items[items.length - 1];
}
