import { startOfToday } from 'date-fns';
import firestore from '@react-native-firebase/firestore';
import { TASKS_COLLECTION } from '../constants';
import { Task } from '@/types';

const createTask = (id: string, title: string, date: Date, game: {}) => {
  const task: Task = {
    id,
    title,
    date,
    game,
  };

  return task;
};

export const getDailyTask = async () => {
  const dateToday = startOfToday();
  const query = await firestore()
    .collection(TASKS_COLLECTION)
    .where('submissionDate', '==', dateToday)
    .orderBy('timestamp', 'desc')
    .limit(1)
    .get();
  const documents = query.docs;

  if (documents.length <= 0) {
    const document = firestore().collection(TASKS_COLLECTION).doc();
    const newDailyTask = createTask(document.id, 'Placeholder Title', dateToday, {});

    await document.set(newDailyTask);
    return newDailyTask;
  }

  console.log(documents.map((document) => document.data()));
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
