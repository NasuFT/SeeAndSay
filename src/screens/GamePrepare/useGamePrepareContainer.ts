import { useDispatch, useSelector } from 'react-redux';

import { Dispatch, RootState } from '@/store';

const useGamePrepareContainer = () => {
  const dispatch = useDispatch<Dispatch>();

  const dailyTask = useSelector((state: RootState) => state.tasks.task);
  const getImageSources = dispatch.tasks.getImageSources;

  return { dailyTask, getImageSources };
};

export default useGamePrepareContainer;
