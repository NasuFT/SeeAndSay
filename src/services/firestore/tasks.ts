import { getDay, startOfToday } from 'date-fns';
import firestore from '@react-native-firebase/firestore';
import { GAMES_COLLECTION, TASKS_COLLECTION } from '../constants';
import { GameInfo, GameType, Task } from '@/types';
import { getRandomValues } from '@/utils/random';
import { omit, random } from 'lodash';

const createRandomTask = async () => {
  // const dayToday = getDay(new Date());

  // if (dayToday === 0 || dayToday === 6) {
  //   return null;
  // }

  // const typeToday: GameType =
  //   dayToday === 1
  //     ? 'classic'
  //     : dayToday === 2
  //     ? 'describeme'
  //     : dayToday === 3
  //     ? 'puzzle'
  //     : dayToday === 4
  //     ? 'scavengerhunt'
  //     : 'fourpicsoneword';

  const randomGameRef = firestore().collection(GAMES_COLLECTION);
  const taskRef = firestore().collection(TASKS_COLLECTION).doc();
  const randomValue = getRandomValues(1)[0];
  const randomIndex = random(1, 5);
  const newRandomValues = getRandomValues(5);

  let query = await randomGameRef
    .where(`random.${randomIndex}`, '<=', randomValue)
    .orderBy(`random.${randomIndex}`, 'desc')
    .limit(1)
    .get();

  if (query.empty) {
    query = await randomGameRef
      .where(`random.${randomIndex}`, '>=', randomValue)
      .orderBy(`random.${randomIndex}`)
      .limit(1)
      .get();
  }

  if (query.empty) {
    return null;
  }

  const document = query.docs[0];
  const data = document.data();
  const game = omit(data, 'random') as GameInfo;

  const batch = firestore().batch();

  const task = {
    id: taskRef.id,
    game,
    submissionDate: startOfToday(),
    timestamp: firestore.FieldValue.serverTimestamp(),
  };

  batch.set(taskRef, task);
  batch.update(document.ref, {
    random: {
      1: newRandomValues[0],
      2: newRandomValues[1],
      3: newRandomValues[2],
      4: newRandomValues[3],
      5: newRandomValues[4],
    },
  });

  await batch.commit();

  return { ...task, timestamp: new Date() } as Task;
};

export const getDailyTask = async () => {
  // const dayToday = getDay(new Date());

  // // saturday or sunday = no task
  // if (dayToday === 0 || dayToday === 6) {
  //   return null;
  // }

  const dateToday = startOfToday();
  const query = await firestore()
    .collection(TASKS_COLLECTION)
    .where('submissionDate', '==', firestore.Timestamp.fromDate(dateToday))
    .orderBy('timestamp', 'desc')
    .limit(1)
    .get();
  const documents = query.docs;

  if (query.empty) {
    const newDailyTask = await createRandomTask();

    return newDailyTask;
  }

  const data = documents[0].data();
  const dailyTask = {
    ...data,
    submissionDate: data.submissionDate.toDate(),
    timestamp: data.timestamp.toDate(),
  } as Task;
  return dailyTask;
};

export const getTaskById = async (id: string) => {
  const query = await firestore().collection(TASKS_COLLECTION).where('id', '==', id).get();
  const documents = query.docs;

  if (documents.length <= 0) {
    throw new Error('No tasks found with given ID!');
  }

  const data = documents[0].data();

  const task = {
    ...data,
    submissionDate: data.submissionDate.toDate(),
    timestamp: data.timestamp.toDate(),
  } as Task;
  return task;
};
