export type GameType = 'classic' | 'describeme' | 'fourpicsoneword' | 'puzzle' | 'scavengerhunt';

export interface GameInfoBase {
  type: GameType;
  seconds: number;
  rounds: number;
  title: string;
}

export type GameDataItemClassic = {
  imgSource: string;
  // default: 'en'; put 'ph' if Filipino
  language?: string;
  word: string;
};
export type GameDataItemFourPicsOneWord = {
  imgSources: string[];
  // default: 'en'; put 'ph' if Filipino
  language?: string;
  word: string;
};
export type GameDataItemDescribeMe = {
  imgSource: string;
  choices: string[];
  answers: string[];
};
export type GameDataItemPuzzle = {
  imgSource: string;
  size: number;
};
export type GameDataItemScavengerHunt = {
  imgSource: string;
  answer: {
    x: number;
    y: number;
  };
  description: string;
};

export type GameDataClassic = GameDataItemClassic[];
export type GameDataFourPicsOneWord = GameDataItemFourPicsOneWord[];
export type GameDataDescribeMe = GameDataItemDescribeMe[];
export type GameDataPuzzle = GameDataItemPuzzle[];
export type GameDataScavengerHunt = GameDataItemScavengerHunt[];

export type GameInfo = GameInfoBase &
  (
    | { type: 'classic'; data: GameDataClassic }
    | {
        type: 'fourpicsoneword';
        data: GameDataFourPicsOneWord;
      }
    | {
        type: 'describeme';
        data: GameDataDescribeMe;
      }
    | {
        type: 'puzzle';
        data: GameDataPuzzle;
      }
    | {
        type: 'scavengerhunt';
        data: GameDataScavengerHunt;
      }
  );
