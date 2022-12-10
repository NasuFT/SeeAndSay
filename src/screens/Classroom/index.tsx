import React from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '@/store';
import { User } from '@/types';

import StudentView from './student/StudentView';
import TeacherView from './teacher/TeacherView';

const Classroom = () => {
  const user = useSelector<RootState, User | null>((state) => state.users.user);
  const isUserTeacher = user?.type === 'teacher';

  if (!user) {
    return null;
  }

  if (isUserTeacher) {
    return <TeacherView />;
  } else {
    return <StudentView />;
  }
};

export default Classroom;
