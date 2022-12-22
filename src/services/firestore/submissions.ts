import {
  SubmissionDataClassic,
  SubmissionDataDescribeMe,
  SubmissionDataPuzzle,
  SubmissionDataScavengerHunt,
  SubmissionInfo,
  Task,
} from '@/types';
import { getMatchingCharacters, interpolate } from '@/utils/helper';
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
    const data = submissionData as SubmissionDataScavengerHunt;
    const grades = data.map(({ answer }, index) => {
      const gameAnswer = gameData[index].answer;
      const distance = Math.pow(
        Math.pow(answer.x - gameAnswer.x, 2) + Math.pow(answer.y - gameAnswer.y, 2),
        0.5
      );

      return interpolate(distance, [5, 100], [100, 0]);
    });
    const sumGrades = grades.reduce((acc, val) => acc + val, 0);
    return sumGrades / gameData.length;
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
      title: task.game.title,
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

export const getUserSubmissions = async (userId: string, limit = 5) => {
  const query = await firestore()
    .collection(SUBMISSIONS_COLLECTION)
    .where('user.id', '==', userId)
    .orderBy('timestamp', 'asc')
    .limitToLast(limit)
    .get();
  const documents = query.docs;

  const submissions = documents.map((document) => {
    const data = document.data();
    const submission = {
      ...data,
      timestamp: data.timestamp.toDate(),
      task: {
        ...data.task,
        submissionDate: data.task.submissionDate.toDate(),
      },
    } as SubmissionInfo;
    return submission;
  });

  return submissions;
};

export const getNonDailyTaskUserSubmission = async (userId: string, dailyTaskId: string) => {
  const query = await firestore()
    .collection(SUBMISSIONS_COLLECTION)
    .where('user.id', '==', userId)
    .where('task.id', '!=', dailyTaskId)
    .orderBy('timestamp')
    .limitToLast(1)
    .get();

  if (query.empty) {
    return null;
  }

  const data = query.docs[0].data();
  const submission = {
    ...data,
    timestamp: data.timestamp.toDate(),
    submissionDate: data.submissionDate.toDate(),
  } as Task;

  return submission;
};

export const getTaskSubmissions = async (taskId: string) => {
  const query = await firestore()
    .collection(SUBMISSIONS_COLLECTION)
    .where('task.id', '==', taskId)
    .get();

  const data = query.docs.map((doc) => doc.data() as SubmissionInfo);

  return data;
};

export const countUserTaskSubmissions = async (userId: string, taskId: string) => {
  return (
    await firestore()
      .collection(SUBMISSIONS_COLLECTION)
      .where('task.id', '==', taskId)
      .where('user.id', '==', userId)
      .count()
      .get()
  ).data();
};

export const getSubmissionById = async (submissionId: string) => {
  const query = await firestore()
    .collection(SUBMISSIONS_COLLECTION)
    .where('id', '==', submissionId)
    .get();

  if (query.empty) {
    return null;
  }

  const data = query.docs[0].data();
  const submission = {
    ...data,
    task: {
      ...data.task,
      submissionDate: data.task.submissionDate.toDate(),
    },
    timestamp: data.timestamp.toDate(),
  } as SubmissionInfo;

  return submission;
};
