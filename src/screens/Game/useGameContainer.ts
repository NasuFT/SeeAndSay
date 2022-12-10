import { Dispatch, RootState } from '@/store';
import { Task } from '@/types';
import { useDispatch, useSelector } from 'react-redux';

const useGameContainer = () => {
  const dispatch = useDispatch<Dispatch>();

  const selectedTask = useSelector((state: RootState) => state.tasks.task);
  const imageSources = useSelector((state: RootState) => state.tasks.imageSources);
  const setSubmissions = dispatch.submissions.setSubmission;
  const setTime = dispatch.submissions.setTime;
  const uploadSubmission = dispatch.submissions.uploadSubmission;

  if (!selectedTask) {
    throw new Error('No task selected!');
  }

  return { selectedTask, imageSources, setSubmissions, setTime, uploadSubmission };
};

export default useGameContainer;
