import { useDispatch, useSelector } from 'react-redux';

import { Dispatch, RootState } from '@/store';

const useGameContainer = () => {
  const dispatch = useDispatch<Dispatch>();

  const dailyTask = useSelector((state: RootState) => state.tasks.task);
  const imageSources = useSelector((state: RootState) => state.tasks.imageSources);
  const setSubmission = dispatch.tasks.setSubmission;
  const uploadSubmission = dispatch.tasks.uploadSubmission;

  if (!dailyTask) {
    throw new Error('No task selected!');
  }

  const finishScreen = () => dispatch.screen.setDidFinishGame(true);

  return { dailyTask, imageSources, setSubmission, uploadSubmission, finishScreen };
};

export default useGameContainer;
