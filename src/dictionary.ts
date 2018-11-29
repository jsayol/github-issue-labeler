import { readdir, outputJSON } from 'fs-extra';
import { resolve } from 'path';
import { Issue } from './types';

/**
 * The maximum number of words to take into account from
 * each issue, including title and description.
 */
export const MAX_WORDS_PER_ENTRY = 1000;

/**
 * Dictionary entry corresponding to a padding.
 */
export const DICT_ENTRY_PADDING = 0;

/**
 * Dictionary entry corresponding to an unknown word.
 */
export const DICT_ENTRY_UNKNOWN = 1;

const DATA_DIR = '../data';

let dictionary: Map<string, number>;

/**
 * Build the dictionary based on the words found in the learning issues.
 */
export async function buildDictionary(): Promise<Map<string, number>> {
  const dictWordSet = new Set<string>();
  const files = await readdir(resolve(__dirname, DATA_DIR, 'issues'));

  for (const file of files) {
    const issue: Issue = require(resolve(__dirname, DATA_DIR, 'issues', file));
    const text = issue.title + ' ' + issue.body;

    for (const word of textToWords(text)) {
      dictWordSet.add(word);
    }
  }

  // Once we have a set with all the words, we build a dictionary where
  // each word corresponds to an integer.
  // Integers 0-4 are reserved for internal use.
  let entryNum = 5;
  const dict = new Map<string, number>();
  for (const word of dictWordSet) {
    dict.set(word, entryNum++);
  }

  if (!dictionary) {
    dictionary = dict;
  }

  return dict;
}

export function saveDictionary(dict: Map<string, number>) {
  return outputJSON(resolve(__dirname, DATA_DIR, 'dictionary.json'), [...dict]);
}

/**
 * Converts a string of text to an array of words.
 * Any code blocks are removed, along with anything that
 * doesn't look like a word.
 */
export function textToWords(text: string): string[] {
  let words = text
    .replace(/```(\w+)([^```]+)```/g, ' ')
    .replace(/([^\w]+)/g, ' ')
    .toLowerCase()
    .split(/\s+/)
    .filter(word => !/^(|(#+)|(\*+)|(\d+))$/.test(word));

  words.splice(MAX_WORDS_PER_ENTRY);

  return words;
}

export function dataStats(data: number[][]) {
  const stats = {
    min: Number.POSITIVE_INFINITY,
    max: Number.NEGATIVE_INFINITY,
    len: data.length
  };

  for (const entry of data) {
    const length = entry.length;
    stats.min = Math.min(stats.min, length);
    stats.max = Math.max(stats.max, length);
  }

  return stats;
}

export function getDictionary(): Map<string, number> {
  if (!dictionary) {
    dictionary = new Map<string, number>(
      require(resolve(__dirname, DATA_DIR, 'dictionary.json'))
    );
  }

  return dictionary;
}
