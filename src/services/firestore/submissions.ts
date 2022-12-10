import {
  SubmissionDataClassic,
  SubmissionDataDescribeMe,
  SubmissionDataPuzzle,
  SubmissionInfo,
  Task,
} from '@/types';
import { getMatchingCharacters } from '@/utils/string';
import firestore from '@react-native-firebase/firestore';
import { SUBMISSIONS_COLLECTION } from '../constants';
import { getTaskById } from './tasks';

interface TaskSubmissionCreateData {
  taskId: string;
  userId: string;
  data: any[];
  time: number;
}

const computeGrade = (task: Task, submissionData: any[]) => {
  const { game } = task;
  const { data: gameData, type } = game;

  if (type === 'classic') {
    const data = submissionData as SubmissionDataClassic;
    const correctCharacters = data.reduce(
      (accumulator, item, index) =>
        accumulator + getMatchingCharacters(item.answer, gameData[index].word),
      0
    );
    const totalCharacters = data.reduce((accumulator, item) => accumulator + item.answer.length, 0);
    return (correctCharacters / totalCharacters) * 100;
  } else if (type === 'fourpicsoneword') {
    const data = submissionData as SubmissionDataClassic;
    const correctCharacters = data.reduce(
      (accumulator, item, index) =>
        accumulator + getMatchingCharacters(item.answer, gameData[index].word),
      0
    );
    const totalCharacters = data.reduce((accumulator, item) => accumulator + item.answer.length, 0);
    return (correctCharacters / totalCharacters) * 100;
  } else if (type === 'describeme') {
    const data = submissionData as SubmissionDataDescribeMe;
    const correctAnswers = data.reduce(
      (accumulator, item, index) =>
        accumulator +
        item.answers.reduce(
          (accumulator, answer) =>
            gameData[index].answers.includes(answer) ? accumulator + 1 : accumulator,
          0
        ),
      0
    );
    const totalChoices = data.reduce((accumulator, item) => accumulator + item.answers.length, 0);

    return (correctAnswers / totalChoices) * 100;
  } else if (type === 'puzzle') {
    const data = submissionData as SubmissionDataPuzzle;
    const correctPositions = data.reduce(
      (accumulator, item) =>
        accumulator +
        item.answer.reduce(
          (accumulator, answer, index) => (answer === index ? accumulator + 1 : accumulator),
          0
        ),
      0
    );
    const totalPositions = gameData.reduce(
      (accumulator, item) => accumulator + item.size * item.size,
      0
    );

    return (correctPositions / totalPositions) * 100;
  } else {
    return 0;
  }
};

export const createTaskSubmission = async ({
  taskId,
  userId,
  data,
  time,
}: TaskSubmissionCreateData) => {
  const task = await getTaskById(taskId);
  const document = firestore().collection(SUBMISSIONS_COLLECTION).doc();

  const newSubmission: SubmissionInfo = {
    id: document.id,
    // @ts-ignore: Technically a date
    timestamp: firestore.FieldValue.serverTimestamp(),
    task: {
      id: taskId,
      title: task.title,
      submissionDate: task.submissionDate,
    },
    type: task.game.type,
    user: {
      id: userId,
    },
    grade: computeGrade(task, data),
    data,
    time,
  };

  await document.set(newSubmission);
  return document.id;
};

export const getUserSubmission = async (userId: string, taskId: string) => {
  const query = await firestore()
    .collection(SUBMISSIONS_COLLECTION)
    .where('user.id', '==', userId)
    .where('task.id', '==', taskId)
    .get();
  const documents = query.docs;

  if (documents.length == 0) {
    return undefined;
  }

  const data = documents[0].data();

  const submission = {
    ...data,
    timestamp: data.timestamp.toDate(),
  } as SubmissionInfo;
  return submission;
};

export const getUserSubmissions = async (userId: string) => {
  const query = await firestore()
    .collection(SUBMISSIONS_COLLECTION)
    .where('user.id', '==', userId)
    .get();
  const documents = query.docs;

  const submissions = documents.map((document) => {
    const data = document.data();
    const submission = {
      ...data,
      timestamp: data.timestamp.toDate(0),
    } as SubmissionInfo;
    return submission;
  });

  return submissions;
};

export const getTaskSubmissions = async (taskId: string) => {
  const query = await firestore()
    .collection(SUBMISSIONS_COLLECTION)
    .where('task.id', '==', taskId)
    .get();

  const data = query.docs.map((doc) => doc.data() as SubmissionInfo);

  return data;
};
