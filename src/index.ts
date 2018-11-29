import { downloadIssues } from './download';
import { buildDictionary, dataStats, saveDictionary } from './dictionary';
import { outputJSON, readJSON } from 'fs-extra';
import { resolve } from 'path';
import { getTrainingData, saveTrainingData, loadTrainingData } from './data';
import { trainModel, testModel } from './train';

// Promise.resolve().then(async () => {
//   await downloadIssues('firebase', 'firebase-js-sdk');

//   const dict = await buildDictionary();
//   await saveDictionary(dict);

//   const labels = [
//     'Component-Auth',
//     'Component-Core',
//     'Component-Database',
//     'Component-Firestore',
//     'Component-Functions',
//     'Component-Messaging',
//     'Component-Storage',
//     'feature-request'
//   ];

//   const data = await getTrainingData(labels);
//   await saveTrainingData(data);

//   const model = await trainModel(data);

//   testModel(model, data);
// });

// downloadIssues('firebase', 'firebase-js-sdk').then(() => process.exit());

// buildDictionary().then(async dict => {
//   console.log('Dictionary size:', dict.size);
//   await saveDictionary(dict);
// });

// const labels = [
//   'Component-Auth',
//   'Component-Core',
//   'Component-Database',
//   'Component-Firestore',
//   'Component-Functions',
//   'Component-Messaging',
//   'Component-Storage',
//   'feature-request'
// ];

// getTrainingData(labels).then(async data => {
//   await saveTrainingData(data);
//   const model = await trainModel(data);
//   testModel(model, data);
// });

// const data = loadTrainingData();
// trainModel(data).then(model => {
//   return testModel(model, data);
// });
