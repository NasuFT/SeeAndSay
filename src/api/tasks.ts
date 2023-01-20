import { GameInfo, GameType, Task } from '@/types';
import { getRandomValue, getRandomValues } from '@/utils/random';
import firestore from '@react-native-firebase/firestore';
import { getDay, startOfDay, startOfToday } from 'date-fns';
import { omit, random } from 'lodash';
import { GAMES_COLLECTION, TASKS_COLLECTION } from './constants';

const createRandomTask = async (type?: GameType, submissionDate?: Date) => {
  const gamesCollection = firestore().collection(GAMES_COLLECTION);
  const tasksCollection = firestore().collection(TASKS_COLLECTION);
  const taskDocument = tasksCollection.doc();

  const randomValue = getRandomValue();
  const randomIndex = random(1, 5);
  const newRandomValues = getRandomValues(5);

  const typeQuery = type ? gamesCollection.where('type', '==', type) : gamesCollection;
  let query = typeQuery
    .where(`random.${randomIndex}`, '<=', randomValue)
    .orderBy(`random.${randomIndex}`, 'desc')
    .limit(1);
  let snapshot = await query.get();

  if (snapshot.empty) {
    query = typeQuery
      .where(`random.${randomIndex}`, '>=', randomValue)
      .orderBy(`random.${randomIndex}`)
      .limit(1);
    snapshot = await query.get();
  }

  if (snapshot.empty) {
    return null;
  }

  const gameDocument = snapshot.docs[0];
  const gameData = gameDocument.data();
  const game = omit(gameData, 'random') as GameInfo;
  const task = {
    id: taskDocument.id,
    game,
    submissionDate: firestore.Timestamp.fromDate(
      submissionDate ? startOfDay(submissionDate) : startOfToday()
    ),
    timestamp: firestore.FieldValue.serverTimestamp(),
  };

  const batch = firestore().batch();

  batch.set(taskDocument, task);
  batch.update(gameDocument.ref, {
    random: {
      1: newRandomValues[0],
      2: newRandomValues[1],
      3: newRandomValues[2],
      4: newRandomValues[3],
      5: newRandomValues[4],
    },
  });

  await batch.commit();

  const { timestamp, ...returnedTask } = task;

  return {
    ...returnedTask,
    submissionDate: submissionDate ? startOfDay(submissionDate) : startOfToday(),
  } as Task;
};

const createDailyTask = async () => {
  //   const day = getDay(new Date());

  //   if (day === 0 || day === 6) {
  //     return null;
  //   }

  //   const type: GameType =
  //     day === 1
  //       ? 'classic'
  //       : day === 2
  //       ? 'describeme'
  //       : day === 3
  //       ? 'puzzle'
  //       : day === 4
  //       ? 'scavengerhunt'
  //       : 'fourpicsoneword';

  return await createRandomTask('classic');
};

export const getTask = async (taskId?: string) => {
  const collection = firestore().collection(TASKS_COLLECTION);
  const query = taskId
    ? collection.where(firestore.FieldPath.documentId(), '==', taskId).limit(1)
    : collection
        .where('submissionDate', '==', firestore.Timestamp.fromDate(startOfToday()))
        .orderBy('timestamp', 'desc')
        .limit(1);
  const snapshot = await query.get();

  if (snapshot.empty) {
    if (!taskId) {
      const dailyTask = await createDailyTask();
      return dailyTask;
    } else {
      throw new Error(`No task found with ID ${taskId}`);
    }
  }

  const data = snapshot.docs[0].data();
  const { timestamp, ...task } = data;
  return {
    ...task,
    submissionDate: task.submissionDate.toDate(),
  } as Task;
};
