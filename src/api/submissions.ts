import firestore from '@react-native-firebase/firestore';
import {
  SubmissionData,
  SubmissionDataClassic,
  SubmissionDataDescribeMe,
  SubmissionDataFourPicsOneWord,
  SubmissionDataPuzzle,
  SubmissionDataScavengerHunt,
  SubmissionInfo,
  Task,
} from '@/types';
import { getMatchingCharacters, interpolate } from '@/utils/helper';
import { SUBMISSIONS_COLLECTION } from './constants';
import { startOfDay, startOfToday } from 'date-fns';
import { getTask } from './tasks';

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
    const data = submissionData as SubmissionDataFourPicsOneWord;
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

      return interpolate(distance, [15, 200], [100, 0]);
    });
    const sumGrades = grades.reduce((acc, val) => acc + val, 0);
    return sumGrades / gameData.length;
  }
};

export const getUserTaskSubmission = async (userId: string, taskId: string) => {
  const collection = firestore().collection(SUBMISSIONS_COLLECTION);
  const query = collection.where('user.id', '==', userId).where('task.id', '==', taskId);
  const snapshot = await query.get();

  const data = snapshot.docs[0].data();
  const submission = {
    ...data,
    timestamp: data.timestamp.toDate(),
    task: {
      ...data.task,
      submissionDate: data.task.submissionDate.toDate(),
    },
  } as SubmissionInfo;
  return submission;
};

export const getUserSubmissions = async (userId: string, limit?: number) => {
  const collection = firestore().collection(SUBMISSIONS_COLLECTION);
  let query = collection.where('user.id', '==', userId).orderBy('timestamp', 'desc');

  if (limit) {
    query = query.limit(limit);
  }

  const snapshot = await query.get();

  const submissions = snapshot.docs.map((document) => {
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

export const getTaskSubmissions = async (taskId: string) => {
  const collection = firestore().collection(SUBMISSIONS_COLLECTION);
  let query = collection.where('task.id', '==', taskId);

  const snapshot = await query.get();

  const submissions = snapshot.docs.map((document) => {
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

interface SubmissionDetails {
  data: SubmissionData;
  time: number;
}

export const uploadTaskSubmission = async (
  userId: string,
  taskId: string,
  SubmissionDetails: SubmissionDetails
) => {
  const collection = firestore().collection(SUBMISSIONS_COLLECTION);
  const document = collection.doc();

  const task = await getTask(taskId);

  if (!task) {
    throw new Error(`No task found with ID ${taskId}`);
  }

  const submission = {
    id: document.id,
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
    grade: computeGrade(task, SubmissionDetails.data),
    data: SubmissionDetails.data,
    time: SubmissionDetails.time,
  };

  await document.set(submission);
};
