import { Dispatch, RootState } from '@/store';
import { useDispatch, useSelector } from 'react-redux';

const useSubmissionInfoContainer = () => {
  const dispatch = useDispatch<Dispatch>();

  const submissions = useSelector((state: RootState) => state.classrooms.submissions);

  const fetchSubmissions = dispatch.classrooms.fetchSubmissions;

  return { submissions, fetchSubmissions };
};

export default useSubmissionInfoContainer;
