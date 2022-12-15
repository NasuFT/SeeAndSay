import { TASKS_COLLECTION } from '@/services/constants';
import { APITask, GameInfo } from '@/types';
import { getRandomValues } from '@/utils/random';
import firestore from '@react-native-firebase/firestore';
import { addDays, startOfDay } from 'date-fns';
import { random, sample, sampleSize } from 'lodash';

const games: GameInfo[] = [
  {
    type: 'classic',
    seconds: 180,
    rounds: 3,
    data: [
      {
        word: 'airplane',
        imgSource:
          'http://192.168.1.7:9199/v0/b/see-and-say-77500.appspot.com/o/test%2Fairplane.jpg?alt=media&token=30ede709-c9a2-4c2c-8178-067107ce9da3',
      },
      {
        word: 'cat',
        imgSource:
          'http://192.168.1.7:9199/v0/b/see-and-say-77500.appspot.com/o/test%2Fcat.jpg?alt=media&token=3a50bddb-0301-4305-8b9b-bc2606463074',
      },
      {
        word: 'baseball',
        imgSource:
          'http://192.168.1.7:9199/v0/b/see-and-say-77500.appspot.com/o/test%2Fbaseball.jpg?alt=media&token=00abbd34-d22f-49c5-9ccd-ece2fb056901',
      },
    ],
  },
  {
    type: 'puzzle',
    seconds: 150,
    rounds: 1,
    data: [
      {
        imgSource:
          'http://192.168.1.7:9199/v0/b/see-and-say-77500.appspot.com/o/test%2Ffood.jpg?alt=media&token=55f251ea-d94b-4765-8d9b-7b1089d96d1d',
        size: 4,
      },
    ],
  },
  {
    type: 'fourpicsoneword',
    seconds: 50,
    rounds: 1,
    data: [
      {
        imgSources: [
          'http://192.168.1.7:9199/v0/b/see-and-say-77500.appspot.com/o/test%2Fflower.jpg?alt=media&token=9de19544-e018-445e-8438-d6256caa8eec',
          'http://192.168.1.7:9199/v0/b/see-and-say-77500.appspot.com/o/test%2Fflower2.jpg?alt=media&token=2c5ac6a3-754f-41ef-8258-746ca571074f',
          'http://192.168.1.7:9199/v0/b/see-and-say-77500.appspot.com/o/test%2Fflower3.jpg?alt=media&token=7608f537-63ec-4c40-b057-b2abc1dc742b',
          'http://192.168.1.7:9199/v0/b/see-and-say-77500.appspot.com/o/test%2Fflower4.jpg?alt=media&token=d23716cc-3ec5-49aa-84ed-de0841db8749',
        ],
        word: 'flower',
      },
    ],
  },
];

const uploadRandomTask = async (game: GameInfo) => {
  const document = firestore().collection(TASKS_COLLECTION).doc();
  const randomValues = getRandomValues(5);
  const randomDays = random(30);
  const submissionDate = addDays(startOfDay(new Date(48659)), randomDays);

  const newTask: APITask = {
    id: document.id,
    submissionDate,
    game,
    title: `Test Task (${game.type})`,
    // @ts-ignore
    timestamp: firestore.FieldValue.serverTimestamp(),
    random: {
      1: randomValues[0],
      2: randomValues[1],
      3: randomValues[2],
      4: randomValues[3],
      5: randomValues[4],
    },
  };

  await document.set(newTask);
  return newTask;
};

export const uploadRandomTasks = async (n: number) => {
  if (n <= games.length) {
    const randomGames = sampleSize(games, n) as GameInfo[];

    return Promise.all(
      Array.from({ length: n }, async (_, i) => await uploadRandomTask(randomGames[i]))
    );
  }

  return Promise.all(
    Array.from({ length: n }, async () => await uploadRandomTask(sample(games) as GameInfo))
  );
};
