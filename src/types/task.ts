import { GameInfo } from './game';

export type TaskInfo = {
  title: string;
  game: GameInfo;
};

export interface Task extends TaskInfo {
  id: string;
  submissionDate: Date;
  timestamp: Date;
}

export interface APITask extends Task {
  random: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number; 
  };
}
