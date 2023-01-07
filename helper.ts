import { GAMES_COLLECTION, USERS_COLLECTION } from '@/services/constants';
import { GameInfo, User } from '@/types';
import { getRandomValues } from '@/utils/random';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { assign, omit } from 'lodash';

const gamesClassic: GameInfo[] = [
  {
    type: 'classic',
    title: 'Classic Task',
    seconds: 300,
    rounds: 5,
    data: [
      {
        imgSource:
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Fclassic%2Fruler.png?alt=media&token=09317463-c77f-4e69-819a-a1cebb3ed2c7',
        word: 'ruler',
      },
      {
        imgSource:
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Fclassic%2Fpencil.png?alt=media&token=5f410261-61e6-4dbe-a96a-7da3dd0c8c2d',
        language: 'ph',
        word: 'lapis',
      },
      {
        imgSource:
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Fclassic%2Fbell.jpg?alt=media&token=e6bb0179-9615-4ef0-baeb-3e3e80ac3ac2',
        word: 'bell',
      },
      {
        imgSource:
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Fclassic%2Fbus.png?alt=media&token=3ac08073-9c5a-48ed-90d8-b0b02e406669',
        word: 'bus',
      },
      {
        imgSource:
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Fclassic%2Fcrayon.png?alt=media&token=3a7970bf-80c3-4079-ab35-15013fe06034',
        word: 'crayon',
      },
    ],
  },
  {
    type: 'classic',
    title: 'Classic Task',
    rounds: 5,
    seconds: 300,
    data: [
      {
        imgSource:
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Fclassic%2Fbrush.png?alt=media&token=79f08c7a-a945-4c62-9778-9d7f727371cf',
        word: 'brush',
      },
      {
        imgSource:
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Fclassic%2Fglobe.png?alt=media&token=07f6bf8e-efd4-435b-b4b2-6a292371ed13',
        word: 'globo',
        language: 'ph',
      },
      {
        imgSource:
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Fclassic%2Fpen.png?alt=media&token=23c13402-d16e-4c6b-bd5c-a0c37bbcf870',
        word: 'pen',
      },
      {
        imgSource:
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Fclassic%2Fnotebook_2.png?alt=media&token=802365d4-8f19-48b9-b159-472222a4f80b',
        language: 'ph',
        word: 'papel',
      },
      {
        imgSource:
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Fclassic%2Fboard.png?alt=media&token=a79278fb-df1b-4b4e-8563-7c8fc9199a2b',
        word: 'board',
      },
    ],
  },
  {
    type: 'classic',
    title: 'Classic Task',
    seconds: 300,
    rounds: 5,
    data: [
      {
        imgSource:
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Fclassic%2Feraser.png?alt=media&token=f096681d-822a-4fe2-a935-d2339de65ef3',
        word: 'eraser',
      },
      {
        imgSource:
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Fclassic%2Fpencil.png?alt=media&token=5f410261-61e6-4dbe-a96a-7da3dd0c8c2d',
        language: 'ph',
        word: 'lapis',
      },
      {
        imgSource:
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Fclassic%2Fnotebook.png?alt=media&token=446a6afe-197e-460d-8154-7e440d0bd866',
        word: 'notebook',
      },
      {
        imgSource:
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Fclassic%2Fscissors.png?alt=media&token=6c2b93d3-c2eb-4b88-b41a-160f789d9a23',
        language: 'ph',
        word: 'gunting',
      },
      {
        imgSource:
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Fclassic%2Fpencilcase.jpg?alt=media&token=9ac681de-c52d-4c07-8c0d-e4c5a676260b',
        word: 'pencilcase',
      },
    ],
  },
];

const gamesPuzzle: GameInfo[] = [
  {
    type: 'puzzle',
    title: 'Puzzle Task',
    rounds: 1,
    seconds: 120,
    data: [
      {
        imgSource:
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Fpuzzle%2Fball.jpg?alt=media&token=cdfa96bc-b6ab-4680-a314-af6078df990f',
        size: 3,
      },
    ],
  },
  {
    type: 'puzzle',
    title: 'Puzzle Task',
    rounds: 1,
    seconds: 120,
    data: [
      {
        imgSource:
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Fpuzzle%2Fcat.jpg?alt=media&token=142e2c68-5f48-46a7-8c12-b028fd6bea79',
        size: 3,
      },
    ],
  },
  {
    type: 'puzzle',
    title: 'Puzzle Task',
    rounds: 1,
    seconds: 120,
    data: [
      {
        imgSource:
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Fpuzzle%2Fmonkey.jpg?alt=media&token=30ca16c0-7067-43e4-a9c6-e2acac7252c5',
        size: 3,
      },
    ],
  },
];

const gamesFourPicsOneWord: GameInfo[] = [
  {
    type: 'fourpicsoneword',
    title: 'Four Pics One Word Task',
    rounds: 3,
    seconds: 210,
    data: [
      {
        imgSources: [
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Ffourpicsoneword%2Fcar.jpg?alt=media&token=0e1bbc65-e2bb-4441-a240-763d65548375',
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Ffourpicsoneword%2Fcar_2.png?alt=media&token=3b4371cf-d5f0-4068-a69e-d4626e7e1105',
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Ffourpicsoneword%2Fcar_3.jpg?alt=media&token=c4a54c6a-aeb7-4cdd-9ff8-4a77b1948b7f',
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Ffourpicsoneword%2Fcar_4.png?alt=media&token=21fd0805-5ff8-42d2-91de-40ed8e94ab0d',
        ],
        word: 'car',
      },
      {
        imgSources: [
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Ffourpicsoneword%2Fball.jpg?alt=media&token=82f448a4-b14a-4a85-a4bd-0f0c7bd913a0',
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Ffourpicsoneword%2Fball_2.jpg?alt=media&token=63f59e7c-42f8-4b78-871d-a098fc2fce18',
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Ffourpicsoneword%2Fball_3.jpeg?alt=media&token=5f3f6078-39ec-464f-b533-cf38b3d9186a',
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Ffourpicsoneword%2Fball_4.jpg?alt=media&token=705c6c7d-3185-416a-b2d6-b8e1cccfe14d',
        ],
        language: 'ph',
        word: 'bola',
      },
      {
        imgSources: [
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Ffourpicsoneword%2Fsleep.jpg?alt=media&token=6f66b7b7-456d-477c-a43b-78e74b98b22f',
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Ffourpicsoneword%2Fsleep_2.jpg?alt=media&token=d90244d5-833d-482d-9a06-a848c3242f18',
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Ffourpicsoneword%2Fsleep_3.jpg?alt=media&token=b043abe3-7370-4695-85a6-f7b26010cba3',
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Ffourpicsoneword%2Fsleep_4.png?alt=media&token=29d2c180-440a-4af1-855d-351ebfc5b94c',
        ],
        word: 'sleep',
      },
    ],
  },
  {
    type: 'fourpicsoneword',
    title: 'Four Pics One Word Task',
    rounds: 3,
    seconds: 210,
    data: [
      {
        imgSources: [
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Ffourpicsoneword%2Fcat.jpg?alt=media&token=d3dfc12e-1d66-4283-ba21-a9a57f36ed48',
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Ffourpicsoneword%2Fcat_2.jpg?alt=media&token=ceacd4e7-ab4d-4cd7-85dd-b2c1171c952e',
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Ffourpicsoneword%2Fcat_3.jpg?alt=media&token=14d7e70b-3c05-49da-a472-3414d7624b02',
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Ffourpicsoneword%2Fcat_4.webp?alt=media&token=bfa6d489-29f6-4c60-8479-66a1bfb7891f',
        ],
        language: 'ph',
        word: 'pusa',
      },
      {
        imgSources: [
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Ffourpicsoneword%2Ffruits.jpg?alt=media&token=42aadd47-36e9-41b4-b344-3fb4afdbeabc',
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Ffourpicsoneword%2Ffruits_2.jpg?alt=media&token=a957ed58-1998-4010-9bab-2ae6f83bae4d',
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Ffourpicsoneword%2Ffruits_3.jpg?alt=media&token=e48fbe7b-01e1-4dda-bac5-7f38e3097ecb',
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Ffourpicsoneword%2Ffruits_4.png?alt=media&token=cf485aab-c44b-4719-a8ef-19f4b47e9cc8',
        ],
        word: 'fruits',
      },
      {
        imgSources: [
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Ffourpicsoneword%2Fteacher.jpg?alt=media&token=2dce94ea-373a-44dc-8894-ed89998ce2a9',
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Ffourpicsoneword%2Fteacher_2.jpg?alt=media&token=478b57ce-9140-4103-acbd-29a8b3cc9e5a',
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Ffourpicsoneword%2Fteacher_3.jpg?alt=media&token=0441e411-b002-4219-b5d8-4d0456da6960',
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Ffourpicsoneword%2Fteacher_4.png?alt=media&token=1fdf552f-d29a-4144-95a6-561bf1306a65',
        ],
        language: 'ph',
        word: 'guro',
      },
    ],
  },
  {
    type: 'fourpicsoneword',
    title: 'Four Pics One Word Task',
    rounds: 3,
    seconds: 210,
    data: [
      {
        imgSources: [
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Ffourpicsoneword%2Fsun.jpg?alt=media&token=9511eefc-fcae-4d45-909b-0ebb34e7db0c',
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Ffourpicsoneword%2Fsun_2.png?alt=media&token=a2d4c2ae-a11b-43bc-8883-51ed5cf81550',
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Ffourpicsoneword%2Fsun_3.jpg?alt=media&token=8c4d8f9d-fc80-487d-9441-5641b12e685d',
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Ffourpicsoneword%2Fsun_4.jpg?alt=media&token=caf3cf64-74dc-4f41-88a0-82cf0998a109',
        ],
        word: 'sun',
      },
      {
        imgSources: [
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Ffourpicsoneword%2Fdog.jpg?alt=media&token=dd92a091-703b-4673-890c-27ce1a0194b1',
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Ffourpicsoneword%2Fdog_2.jpg?alt=media&token=992ef287-e3dd-40a8-a661-5547bf0a1f9f',
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Ffourpicsoneword%2Fdog_3.jpg?alt=media&token=29df348f-7890-48e7-8dae-175a01016c5f',
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Ffourpicsoneword%2Fdog_4.png?alt=media&token=8a4bd02d-d2f2-4803-bd36-0369b89cf037',
        ],
        language: 'ph',
        word: 'aso',
      },
      {
        imgSources: [
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Ffourpicsoneword%2Fball.jpg?alt=media&token=82f448a4-b14a-4a85-a4bd-0f0c7bd913a0',
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Ffourpicsoneword%2Fball_2.jpg?alt=media&token=63f59e7c-42f8-4b78-871d-a098fc2fce18',
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Ffourpicsoneword%2Fball_3.jpeg?alt=media&token=5f3f6078-39ec-464f-b533-cf38b3d9186a',
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Ffourpicsoneword%2Fball_4.jpg?alt=media&token=705c6c7d-3185-416a-b2d6-b8e1cccfe14d',
        ],
        word: 'ball',
      },
    ],
  },
];

const gamesDescribeMe: GameInfo[] = [
  {
    type: 'describeme',
    title: 'Describe Me Task',
    seconds: 260,
    rounds: 3,
    data: [
      {
        imgSource:
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Fdescribeme%2Fapple.jpg?alt=media&token=d7e23a6c-b7dd-435c-8249-fcd30390fabe',
        choices: ['Sweet', 'Blue', 'Sour', 'Unhealthy'],
        answers: ['Sweet'],
      },
      {
        imgSource:
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Fdescribeme%2Fball.jpg?alt=media&token=cc725f72-1d65-412c-bc88-9b3ede4a1904',
        choices: ['Round', 'Square', 'Long', 'Sharp'],
        answers: ['Round'],
      },
      {
        imgSource:
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Fdescribeme%2Fboy.jpg?alt=media&token=f021a487-404b-452f-9838-6703b0eb12f3',
        choices: ['Lalaki', 'Babae', 'Male', 'Female'],
        answers: ['Lalaki', 'Male'],
      },
    ],
  },
  {
    type: 'describeme',
    title: 'Describe Me Task',
    seconds: 260,
    rounds: 3,
    data: [
      {
        imgSource:
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Fdescribeme%2Fclouds.jpg?alt=media&token=5a9876f3-eb1f-45ce-af51-518292639259',
        choices: ['White', 'Soft', 'Round', 'Fluffy'],
        answers: ['White'],
      },
      {
        imgSource:
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Fdescribeme%2Fgirl.jpg?alt=media&token=20c726e5-88ba-4556-a6ea-955a551e1ae2',
        choices: ['Lalaki', 'Babae', 'Blue', 'Pink'],
        answers: ['Babae', 'Pink'],
      },
      {
        imgSource:
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Fdescribeme%2Fsun.jpg?alt=media&token=c6fddf2b-0158-4fab-9c14-ec46b8e49f62',
        choices: ['Orange', 'Bright', 'Hot', 'Big'],
        answers: ['Orange', 'Bright', 'Hot', 'Big'],
      },
    ],
  },
  {
    type: 'describeme',
    title: 'Describe Me Task',
    seconds: 260,
    rounds: 3,
    data: [
      {
        imgSource:
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Fdescribeme%2Frock.png?alt=media&token=b2eb5959-5670-4103-83ea-b154f60af3b3',
        choices: ['Smooth', 'Hard', 'Big', 'Small'],
        answers: ['Hard', 'Big'],
      },
      {
        imgSource:
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Fdescribeme%2Ftowel.jpg?alt=media&token=2eb60100-a761-4ad5-b761-09ec9456e6aa',
        choices: ['Soft', 'Hard', 'Rectangular', 'Square'],
        answers: ['Soft', 'Rectangular'],
      },
      {
        imgSource:
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Fdescribeme%2Ffire.png?alt=media&token=9349f242-d96e-4d39-a363-068dfdef015b',
        choices: ['Madilim', 'Mainit', 'Malamig', 'Maliwanag'],
        answers: ['Mainit', 'Maliwanag'],
      },
    ],
  },
];

const gamesScavengerHunt: GameInfo[] = [
  {
    type: 'scavengerhunt',
    title: 'Scavenger Hunt Task',
    seconds: 120,
    rounds: 1,
    data: [
      {
        imgSource:
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Fscavengerhunt%2Fcolors.jpg?alt=media&token=35c34814-f0e0-40e8-9386-4902da8148f0',
        answer: {
          x: 0.3389,
          y: -66.1017,
        },
        description: 'Find the pink ball!',
      },
    ],
  },
  {
    type: 'scavengerhunt',
    title: 'Scavenger Hunt Task',
    seconds: 120,
    rounds: 1,
    data: [
      {
        imgSource:
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Fscavengerhunt%2Fpoliceman.jpg?alt=media&token=861aeb2e-5077-432b-a6ac-432a7f9f9b29',
        answer: {
          x: -76.4,
          y: -64.5714,
        },
        description: 'Hanapin ang doktor!',
      },
    ],
  },
  {
    type: 'scavengerhunt',
    title: 'Scavenger Hunt Task',
    seconds: 120,
    rounds: 1,
    data: [
      {
        imgSource:
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Fscavengerhunt%2Ffrutis.jpg?alt=media&token=941407c0-5c10-4af1-8df0-73f398816e54',
        answer: {
          x: -43.75,
          y: 74.5192,
        },
        description: 'Hanapin ang saging!',
      },
    ],
  },
  {
    type: 'scavengerhunt',
    title: 'Scavenger Hunt Task',
    seconds: 120,
    rounds: 1,
    data: [
      {
        imgSource:
          'https://firebasestorage.googleapis.com/v0/b/see-and-say-77500.appspot.com/o/games%2Fscavengerhunt%2Fschool.jpg?alt=media&token=da3fce21-1643-43a9-ac21-6c5886180fb6',
        answer: {
          x: 77.0492,
          y: -8.3333,
        },
        description: 'Find the backpack!',
      },
    ],
  },
];

const games = gamesClassic.concat(
  gamesPuzzle,
  gamesDescribeMe,
  gamesFourPicsOneWord,
  gamesScavengerHunt
);

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

interface APIUser extends Omit<User, 'id'> {
  password: string;
}

const users: APIUser[] = [
  {
    firstName: 'Leanne',
    lastName: 'Graham',
    email: 'test_teacher1@email.com',
    password: 'teacher1',
    type: 'teacher',
  },
  {
    firstName: 'Ervin',
    lastName: 'Howell',
    email: 'test_teacher2@email.com',
    password: 'teacher2',
    type: 'teacher',
  },
  {
    firstName: 'Clementine',
    lastName: 'Bauch',
    email: 'test_student1@email.com',
    password: 'student1',
    type: 'student',
  },
  {
    firstName: 'Patricia',
    lastName: 'Lebsack',
    email: 'test_student2@email.com',
    password: 'student2',
    type: 'student',
  },
  {
    firstName: 'Chelsey',
    lastName: 'Dietrich',
    email: 'test_student3@email.com',
    password: 'student3',
    type: 'student',
  },
  {
    firstName: 'Dennis',
    lastName: 'Schulist',
    email: 'test_student4@email.com',
    password: 'student4',
    type: 'student',
  },
  {
    firstName: 'Kurtis',
    lastName: 'Weissnat',
    email: 'test_student5@email.com',
    password: 'student5',
    type: 'student',
  },
  {
    firstName: 'Nicholas',
    lastName: 'Runolfsdottir',
    email: 'test_student6@email.com',
    password: 'student6',
    type: 'student',
  },
];

const convertToLocalUser = (user: APIUser, id: string) => {
  const newUser: User = assign(omit(user, 'password'), { id });
  return newUser;
};

const uploadUser = async (user: APIUser) => {
  const usersRef = firestore().collection(USERS_COLLECTION);
  const userCredential = await auth().createUserWithEmailAndPassword(user.email, user.password);
  await usersRef.add(convertToLocalUser(user, userCredential.user.uid));
};

export const uploadUsers = async () => {
  return Promise.all(users.map(async (user) => await uploadUser(user)));
};
