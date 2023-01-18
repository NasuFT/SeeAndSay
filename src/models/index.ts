import { Models } from '@rematch/core';
import { tasks } from './tasks';
import { users } from './users';

export interface RootModel extends Models<RootModel> {
  users: typeof users;
  tasks: typeof tasks;
}

export const models: RootModel = { users, tasks };
