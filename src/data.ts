import { readdir, readJSON, outputJSON } from 'fs-extra';
import { resolve } from 'path';
import { Issue } from './types';
import { getDictionary, textToWords, DICT_ENTRY_UNKNOWN } from './dictionary';
import { shuffleArrays } from './util';

const DATA_DIR = '../data';

export async function getTrainingData(labels: string[]): Promise<TrainingData> {
  const files = await readdir(resolve(__dirname, DATA_DIR, 'issues'));
  const dict = getDictionary();

  let inputs: number[][] = [];
  let outputs: (1 | 0)[][] = [];

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

  // Shuffle the arrays to eliminate any bias (older/newer issues)
  // when splitting the data.
  [inputs, outputs] = shuffleArrays([inputs, outputs]);

  // Split the data between training and test, with 90% for training
  // and 10% for testing.
  const countForTraining = Math.ceil(0.9 * files.length);

  return {
    labels,
    training: {
      inputs: inputs.slice(0, countForTraining),
      outputs: outputs.slice(0, countForTraining)
    },
    test: {
      inputs: inputs.slice(countForTraining),
      outputs: outputs.slice(countForTraining)
    }
  };
  // return { inputs, inputsTensor, labels, labelsTensor };
}

export function saveTrainingData(data: TrainingData): Promise<any> {
  return Promise.all([
    outputJSON(resolve(__dirname, DATA_DIR, 'labels.json'), data.labels),
    outputJSON(
      resolve(__dirname, DATA_DIR, 'training-inputs.json'),
      data.training.inputs
    ),
    outputJSON(
      resolve(__dirname, DATA_DIR, 'training-outputs.json'),
      data.training.outputs
    ),
    outputJSON(
      resolve(__dirname, DATA_DIR, 'test-inputs.json'),
      data.test.inputs
    ),
    outputJSON(
      resolve(__dirname, DATA_DIR, 'test-outputs.json'),
      data.test.outputs
    )
  ]);
}

export function loadTrainingData(): TrainingData {
  return {
    labels: require(resolve(__dirname, DATA_DIR, 'labels.json')),
    training: {
      inputs: require(resolve(__dirname, DATA_DIR, 'training-inputs.json')),
      outputs: require(resolve(__dirname, DATA_DIR, 'training-outputs.json'))
    },
    test: {
      inputs: require(resolve(__dirname, DATA_DIR, 'test-inputs.json')),
      outputs: require(resolve(__dirname, DATA_DIR, 'test-outputs.json'))
    }
  };
}

export interface TrainingData {
  labels: string[];
  training: {
    inputs: number[][];
    outputs: (1 | 0)[][];
  };
  test: {
    inputs: number[][];
    outputs: (1 | 0)[][];
  };
}
