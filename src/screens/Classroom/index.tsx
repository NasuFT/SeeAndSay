import React from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '@/store';
import { User } from '@/types';

import TeacherView from './teacher/TeacherView';

const Classroom = () => {
  const user = useSelector<RootState, User | null>((state) => state.users.user);

  if (!user) {
    return null;
  }

  return <TeacherView />;
};

export default Classroom;
