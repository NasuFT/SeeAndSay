import { startOfToday } from 'date-fns';
import firestore from '@react-native-firebase/firestore';
import { TASKS_COLLECTION } from '../constants';
import { APITask, Task } from '@/types';
import { getRandomValues } from '@/utils/random';
import { omit, random } from 'lodash';

const uploadTask = async (task: Task) => {
  const randomValues = getRandomValues(5);

  const toUploadTask: APITask = {
    ...task,
    //@ts-ignore
    timestamp: firestore.FieldValue.serverTimestamp(),
    random: {
      1: randomValues[0],
      2: randomValues[1],
      3: randomValues[2],
      4: randomValues[3],
      5: randomValues[4],
    },
  };

  const document = await firestore().collection(TASKS_COLLECTION).add(toUploadTask);

  return document.id;
};

const getRandomTask = async () => {
  const randomValue = getRandomValues(1)[0];
  const randomIndex = random(1, 5);

  let query = await firestore()
    .collection(TASKS_COLLECTION)
    .where(`random.${randomIndex}`, '<=', randomValue)
    .orderBy(`random.${randomIndex}`, 'desc')
    .limit(1)
    .get();

  if (query.empty) {
    query = await firestore()
      .collection(TASKS_COLLECTION)
      .where(`random.${randomIndex}`, '>=', randomValue)
      .orderBy(`random.${randomIndex}`)
      .limit(1)
      .get();
  }

  const document = query.docs[0];
  const data = document.data() as APITask;
  const task = {
    ...omit(data, 'random'),
    // @ts-ignore
    timestamp: data.timestamp.toDate(),
    submissionDate: startOfToday(),
  } as Task;

  return task;
};

export const getDailyTask = async () => {
  const dateToday = startOfToday();
  const query = await firestore()
    .collection(TASKS_COLLECTION)
    .where('submissionDate', '==', firestore.Timestamp.fromDate(dateToday))
    .orderBy('timestamp', 'desc')
    .limit(1)
    .get();
  const documents = query.docs;

  if (query.empty) {
    const newDailyTask = await getRandomTask();

    await uploadTask(newDailyTask);
    return {
      ...newDailyTask,
      timestamp: new Date(),
    } as Task;
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
