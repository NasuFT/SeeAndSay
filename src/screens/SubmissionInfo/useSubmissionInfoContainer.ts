import { Dispatch, RootState } from '@/store';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useSubmissionInfoContainer = () => {
  const dispatch = useDispatch<Dispatch>();

  const fetchSubmissions = dispatch.classrooms.fetchEnrolleeSubmissions;
  const submissions = useSelector((state: RootState) => state.classrooms.submissions);

  return { submissions, fetchSubmissions };
};

export default useSubmissionInfoContainer;
