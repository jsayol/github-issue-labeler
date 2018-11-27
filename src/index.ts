import { download } from './download';
import { buildDictionary, dataStats, saveDictionary } from './dictionary';
import { outputJSON, readJSON } from 'fs-extra';
import { resolve } from 'path';
import { getTrainingData, saveTrainingData } from './data';

// download('firebase', 'firebase-js-sdk').then(() => process.exit());

// buildDictionary().then(async dict => {
//   console.log('Dictionary size:', dict.size);
//   await saveDictionary(dict);
// });

const requestedLabels = [
  'Component-Auth',
  'Component-Core',
  'Component-Database',
  'Component-Firestore',
  'Component-Functions',
  'Component-Messaging',
  'Component-Storage',
  'feature-request'
];

getTrainingData(requestedLabels).then(data => {
  return saveTrainingData(data);
});
