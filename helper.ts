import { GAMES_COLLECTION, TASKS_COLLECTION } from '@/services/constants';
import { GameInfo } from '@/types';
import { getRandomValues } from '@/utils/random';
import firestore from '@react-native-firebase/firestore';
import { addDays, startOfDay } from 'date-fns';
import { random, sample, sampleSize } from 'lodash';

const games: GameInfo[] = [
  {
    type: 'classic',
    title: 'Test Task ("Classic")',
    seconds: 180,
    rounds: 3,
    data: [
      {
        word: 'airplane',
        imgSource:
          'http://192.168.1.7:9199/v0/b/see-and-say-77500.appspot.com/o/airplane.jpg?alt=media&token=d3f37e1c-5756-479b-9417-45ca90ef2fb6',
      },
      {
        word: 'cat',
        imgSource:
          'http://192.168.1.7:9199/v0/b/see-and-say-77500.appspot.com/o/cat.jpg?alt=media&token=d6f02986-9c84-4f91-a0df-6baf71d4fdea',
      },
      {
        word: 'baseball',
        imgSource:
          'http://192.168.1.7:9199/v0/b/see-and-say-77500.appspot.com/o/baseball.jpg?alt=media&token=ffb0bd43-2754-4cf6-8bdf-96a47f30c2e8',
      },
    ],
  },
  {
    type: 'puzzle',
    title: 'Test Task ("Puzzle")',
    seconds: 150,
    rounds: 1,
    data: [
      {
        imgSource:
          'http://192.168.1.7:9199/v0/b/see-and-say-77500.appspot.com/o/food.jpg?alt=media&token=fc16d595-0016-4b91-82f2-c635006496d2',
        size: 4,
      },
    ],
  },
  {
    type: 'fourpicsoneword',
    title: 'Test Task ("Four Pics One Word")',
    seconds: 50,
    rounds: 1,
    data: [
      {
        imgSources: [
          'http://192.168.1.7:9199/v0/b/see-and-say-77500.appspot.com/o/flower.jpg?alt=media&token=e838f687-ca33-45bf-8234-eb7d96247a36',
          'http://192.168.1.7:9199/v0/b/see-and-say-77500.appspot.com/o/flower2.jpg?alt=media&token=1058d92a-c8f5-45bb-99fa-0497f1625608',
          'http://192.168.1.7:9199/v0/b/see-and-say-77500.appspot.com/o/flower3.jpg?alt=media&token=65ba28fc-bfdd-4fc8-9c00-8ae4ec1ebd98',
          'http://192.168.1.7:9199/v0/b/see-and-say-77500.appspot.com/o/flower4.jpg?alt=media&token=8bca5066-fa54-49fb-ba3c-96e4809f5485',
        ],
        word: 'flower',
      },
    ],
  },
];

const uploadGame = async (game: GameInfo) => {
  const document = firestore().collection(GAMES_COLLECTION).doc();
  const randomValues = getRandomValues(5);

  const data = {
    ...game,
    random: {
      1: randomValues[0],
      2: randomValues[1],
      3: randomValues[2],
      4: randomValues[3],
      5: randomValues[4],
    },
  };

  await document.set(data);
};

export const uploadGames = async () => {
  return Promise.all(games.map(async (game) => await uploadGame(game)));
};
