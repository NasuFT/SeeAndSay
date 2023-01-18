import { GameType } from './game';

export interface SubmissionInfoBase {
  id: string;
  task: {
    id: string;
    title: string;
    submissionDate: Date;
  };
  user: {
    id: string;
  };
  grade: number;
  type: GameType;
  timestamp: Date;
}

export type SubmissionDataClassic = {
  answer: string;
}[];

export type SubmissionDataFourPicsOneWord = {
  answer: string;
}[];

export type SubmissionDataDescribeMe = {
  answers: string[];
}[];

export type SubmissionDataPuzzle = {
  answer: number[];
}[];

export type SubmissionDataScavengerHunt = {
  answer: {
    x: number;
    y: number;
  };
}[];

export type SubmissionData =
  | SubmissionDataClassic
  | SubmissionDataDescribeMe
  | SubmissionDataFourPicsOneWord
  | SubmissionDataPuzzle
  | SubmissionDataScavengerHunt;

export type SubmissionInfo = SubmissionInfoBase &
  (
    | {
        type: 'classic';
        data: SubmissionDataClassic;
      }
    | {
        type: 'fourpicsoneword';
        data: SubmissionDataFourPicsOneWord;
      }
    | {
        type: 'describeme';
        data: SubmissionDataDescribeMe;
      }
    | { type: 'puzzle'; data: SubmissionDataPuzzle }
    | {
        type: 'scavengerhunt';
        data: SubmissionDataScavengerHunt;
      }
  );
