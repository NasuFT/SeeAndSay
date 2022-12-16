import { Models } from '@rematch/core';
import { selects } from './selects';
import { submissions } from './submissions';
import { tasks } from './tasks';
import { users } from './users';

export interface RootModel extends Models<RootModel> {
  users: typeof users;
  selects: typeof selects;
  tasks: typeof tasks;
  submissions: typeof submissions;
}

export const models: RootModel = { users, selects, tasks, submissions };
