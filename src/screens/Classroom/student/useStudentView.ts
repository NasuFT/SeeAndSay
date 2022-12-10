import { useDispatch, useSelector } from 'react-redux';

import { Dispatch, RootState } from '@/store';
import { Task } from '@/types';

const useStudentView = () => {
  const dispatch = useDispatch<Dispatch>();

  const dailyTask = useSelector<RootState, Task | null>((state) => state.tasks.dailyTask);
  const fetchDailyTask = dispatch.tasks.fetchDailyTask;

  return { dailyTask, fetchDailyTask };
};

export default useStudentView;
