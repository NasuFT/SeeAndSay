import { GameInfo } from './game';

export type TaskInfo = {
  game: GameInfo;
};

export interface Task extends TaskInfo {
  id: string;
  submissionDate: Date;
}
