import { readdir, readJSON, outputJSON } from 'fs-extra';
import { resolve } from 'path';
import { Issue } from './types';
import { getDictionary, textToWords, DICT_ENTRY_UNKNOWN } from './dictionary';
// import tf from '@tensorflow/tfjs';
// import '@tensorflow/tfjs-node-gpu';

const DATA_DIR = '../data';

export async function getTrainingData(labels: string[]): Promise<TrainingData> {
  const files = await readdir(resolve(__dirname, DATA_DIR, 'issues'));
  const dict = getDictionary();

  const inputs: number[][] = [];
  const outputs: (1 | 0)[][] = [];

  for (const file of files) {
    const issue: Issue = await readJSON(
      resolve(__dirname, DATA_DIR, 'issues', file)
    );
    const wordIntegers = new Set<number>();
    const text = issue.title + ' ' + issue.body;
    const words = textToWords(text);

    for (const word of words) {
      wordIntegers.add(dict.get(word) || DICT_ENTRY_UNKNOWN);
    }

    const labelTags = labels.map(reqLabel => {
      const hasLabel = issue.labels.some(
        issueLabel => issueLabel.name === reqLabel
      );
      return hasLabel ? 1 : 0;
    });

    inputs.push([...wordIntegers]);
    outputs.push(labelTags);
  }

  // const inputsTensor = tf.tensor2d(inputs);
  // const labelsTensor = tf.tensor2d(labels);

  return { inputs, outputs, labels };
  // return { inputs, inputsTensor, labels, labelsTensor };
}

export function saveTrainingData(data: TrainingData): Promise<any> {
  return Promise.all([
    outputJSON(resolve(__dirname, DATA_DIR, 'inputs.json'), data.inputs),
    outputJSON(resolve(__dirname, DATA_DIR, 'outputs.json'), data.outputs),
    outputJSON(resolve(__dirname, DATA_DIR, 'labels.json'), data.labels)
  ]);
}

export interface TrainingData {
  inputs: number[][];
  outputs: (1 | 0)[][];
  labels: string[];
  // inputsTensor: tf.Tensor<tf.Rank.R2>;
  // labelsTensor: tf.Tensor<tf.Rank.R2>;
}
