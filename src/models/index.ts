import { Models } from '@rematch/core';
import { classrooms } from './classrooms';
import submissions from './submissions';
import { tasks } from './tasks';
import { users } from './users';

export interface RootModel extends Models<RootModel> {
  users: typeof users;
  classrooms: typeof classrooms;
  tasks: typeof tasks;
  submissions: typeof submissions;
}

export const models: RootModel = { users, classrooms, tasks, submissions };
