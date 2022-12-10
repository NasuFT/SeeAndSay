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
