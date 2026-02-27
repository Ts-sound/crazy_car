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

/**
 * WeightedPool - creates a shuffled pool based on weights
 * Ensures short-term fair distribution while maintaining long-term weights
 */
export class WeightedPool {
  /**
   * @param {Array} items - Items to pick from
   * @param {Array} weights - Corresponding weights (integers)
   * @param {number} poolSize - Size of the pool (default 50)
   */
  constructor(items, weights, poolSize = 50) {
    this.items = items;
    this.weights = weights;
    this.poolSize = poolSize;
    this.pool = [];
    this.index = 0;
    
    // Statistics tracking
    this.stats = {};
    this.totalPicks = 0;
    items.forEach(item => {
      this.stats[item] = 0;
    });
    
    this.refill();
  }

  /**
   * Refill the pool with weighted items
   */
  refill() {
    this.pool = [];
    const totalWeight = this.weights.reduce((a, b) => a + b, 0);
    
    // Calculate expected count for each item based on weights
    let remaining = this.poolSize;
    const counts = [];
    
    for (let i = 0; i < this.items.length; i++) {
      const count = Math.floor((this.weights[i] / totalWeight) * this.poolSize);
      counts.push(count);
      remaining -= count;
    }
    
    // Distribute remaining slots to highest weight items
    let sortedIndices = this.weights
      .map((w, i) => ({ weight: w, index: i }))
      .sort((a, b) => b.weight - a.weight)
      .map(item => item.index);
    
    for (let i = 0; i < remaining && i < sortedIndices.length; i++) {
      counts[sortedIndices[i]]++;
    }
    
    // Build the pool
    for (let i = 0; i < this.items.length; i++) {
      for (let j = 0; j < counts[i]; j++) {
        this.pool.push(this.items[i]);
      }
    }
    
    // Shuffle the pool
    shuffle(this.pool);
    this.index = 0;
  }

  /**
   * Pick next item from pool
   * @returns {*} - Selected item
   */
  pick() {
    if (this.index >= this.pool.length) {
      // Print stats before refill (every poolSize picks)
      if (this.totalPicks > 0) {
        this.printStats(`Pool exhausted (picked ${this.totalPicks})`);
      }
      this.refill();
    }
    const item = this.pool[this.index++];
    this.stats[item]++;
    this.totalPicks++;
    return item;
  }

  /**
   * Reset pool to beginning
   */
  reset() {
    // Print final stats before reset
    if (this.totalPicks > 0) {
      this.printStats('Game Reset - Final Stats');
    }
    
    // Reset stats
    this.items.forEach(item => {
      this.stats[item] = 0;
    });
    this.totalPicks = 0;
    this.index = 0;
    this.refill();
  }

  /**
   * Print statistics to console
   * @param {string} message - Message to display
   */
  printStats(message = 'Power-Up Statistics') {
    console.log(`\n=== ${message} ===`);
    console.log(`Total: ${this.totalPicks}`);
    
    if (this.totalPicks === 0) {
      console.log('No power-ups generated yet. Start the game and collect power-ups!');
      console.log('========================\n');
      return;
    }
    
    const emojis = {
      'EXTRA_LIFE': '❤️',
      'SHIELD': '🛡️',
      'SLOW_MOTION': '⏰',
      'MAGNET': '🧲',
      'DOUBLE_SCORE': '2x'
    };
    
    console.log('Distribution:');
    this.items.forEach((type, i) => {
      const count = this.stats[type];
      const percentage = this.totalPicks > 0 
        ? ((count / this.totalPicks) * 100).toFixed(1) 
        : 0;
      const expected = this.weights[i];
      console.log(`  ${emojis[type]} ${type.padEnd(14)}: ${String(count).padEnd(3)} (${percentage}%) [expected: ${expected}%]`);
    });
    console.log('========================\n');
  }

  /**
   * Get remaining count in current pool
   * @returns {number}
   */
  remaining() {
    return this.pool.length - this.index;
  }

  /**
   * Get current statistics
   * @returns {Object} - Statistics object
   */
  getStats() {
    return { ...this.stats, totalPicks: this.totalPicks };
  }
}
