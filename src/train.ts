import tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-node-gpu';
import { readdir, readJSON } from 'fs-extra';
import { resolve } from 'path';
import {
  textToIntArray,
  dataStats,
  MAX_WORDS_PER_ENTRY,
  getDictionary,
  DICT_ENTRY_PADDING
} from './dictionary';
import { Issue } from './types';

const DATA_DIR = '../data';

/**
 * Pads the data array in place, adding 0's at the end of each
 * entry.
 */
export function padData(data: number[][]): number[][] {
  const stats = dataStats(data);
  const padLength = Math.min(MAX_WORDS_PER_ENTRY, stats.max);

  for (const entry of data) {
    const entryLength = entry.length;
    if (entryLength < padLength) {
      entry.length = padLength;
      entry.fill(DICT_ENTRY_PADDING, entryLength);
    }
  }

  return data;
}

/**
 * Builds the model that will be trained.
 */
export function buildModel() {
  const dictionary = getDictionary();

  const model = tf.sequential({
    layers: [
      tf.layers.embedding({ inputDim: dictionary.size, outputDim: 16 }),
      tf.layers.globalAveragePooling1d({}),
      tf.layers.dense({ units: 16, activation: 'relu' }),
      tf.layers.dense({ units: 1, activation: 'sigmoid' })
    ]
  });

  model.summary();
}
