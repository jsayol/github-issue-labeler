// Choo choo! 🚂 🚆 🚄 🚅 🚉 🚞 🚝 🛤️ 🚈 

import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-node';
import {
  dataStats,
  MAX_WORDS_PER_ENTRY,
  getDictionary,
  DICT_ENTRY_PADDING
} from './dictionary';
import { TrainingData } from './data';
import { ModelFitConfig } from '@tensorflow/tfjs';

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
 * Builds and trains the model with the trainign data.
 */
export async function trainModel(data: TrainingData): Promise<tf.Model> {
  const dictionary = getDictionary();

  const hiddenUnits = 16 * data.labels.length;

  const model = tf.sequential({
    layers: [
      tf.layers.embedding({
        inputDim: dictionary.size + 5, // There's 5 reserved extra positions in the dictionary
        outputDim: hiddenUnits
      }),
      tf.layers.globalAveragePooling1d({}),
      tf.layers.dense({ units: hiddenUnits, activation: 'sigmoid' }),
      tf.layers.dense({ units: data.labels.length, activation: 'softmax' })
    ]
  });

  // Tensors
  const xTensor = tf.tensor2d(padData(data.training.inputs), void 0, 'int32');
  const yTensor = tf.tensor2d(data.training.outputs, void 0, 'float32');

  // Create an optimizer
  const learningRate = 0.02;
  const optimizer = tf.train.sgd(learningRate);

  // Compile the model
  model.compile({
    optimizer,
    loss: 'meanSquaredError'
  });

  // Train the model
  const options: ModelFitConfig = {
    epochs: 50,
    shuffle: true,
    validationSplit: 0.1
  };
  const result = await model.fit(xTensor, yTensor, options);
  console.log(result);

  // Dispose of any data we don't need anymore, to free memory up
  xTensor.dispose();
  yTensor.dispose();

  return model;
}

export function testModel(model: tf.Model, data: TrainingData) {
  const xTensor = tf.tensor2d(padData(data.test.inputs));
  const result = model.predict(xTensor) as tf.Tensor;
  xTensor.dispose();

  const r = result.dataSync();
  let output: number[][] = [];

  const [xSize, ySize] = result.shape;

  for (let i = 0; i < xSize; i++) {
    output[i] = [];
    for (let j = 0; j < ySize; j++) {
      output[i][j] = r[i * ySize + j];
    }
  }

  console.log(output);
}
