import { Dispatch, RootState } from '@/store';
import { useDispatch, useSelector } from 'react-redux';

const useSubmissionInfoContainer = () => {
  const dispatch = useDispatch<Dispatch>();

  const fetchSubmissions = dispatch.selects.fetchEnrolleeSubmissions;
  const submissions = useSelector((state: RootState) => state.selects.submissions);

  return { submissions, fetchSubmissions };
};

export default useSubmissionInfoContainer;
