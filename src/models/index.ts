import { Models } from '@rematch/core';
import { screen } from './screen';
import { tasks } from './tasks';
import { users } from './users';

export interface RootModel extends Models<RootModel> {
  users: typeof users;
  tasks: typeof tasks;
  screen: typeof screen;
}

export const models: RootModel = { users, tasks, screen };
