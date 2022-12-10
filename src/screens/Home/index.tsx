import { useSelector } from 'react-redux';

import { RootState } from '@/store';

import TeacherView from './teacher/TeacherView';
import StudentView from './student/StudentView';

const Home = () => {
  const user = useSelector((state: RootState) => state.users.user);
  const isUserTeacher = user?.type === 'teacher';

  if (isUserTeacher) {
    return <TeacherView />;
  } else {
    return <StudentView />;
  }
};

export default Home;
