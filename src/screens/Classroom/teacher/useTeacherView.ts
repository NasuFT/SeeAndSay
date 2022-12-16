import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Dispatch, RootState } from '@/store';

const useTeacherView = () => {
  const dispatch = useDispatch<Dispatch>();

  const enrollees = useSelector((state: RootState) => state.selects.enrollees);
  const fetchEnrolls = dispatch.selects.fetchEnrollees;
  const setEnrollee = dispatch.selects.setEnrollee;

  const dailyTaskSubmissions = useSelector(
    (state: RootState) => state.selects.dailyTaskSubmissions
  );
  const fetchGrades = dispatch.selects.fetchDailyTaskSubmissions;

  const grades = useMemo(
    () => dailyTaskSubmissions.map((submission) => submission.grade),
    [dailyTaskSubmissions]
  );

  return { enrollees, fetchEnrolls, setEnrollee, fetchGrades, grades };
};

export default useTeacherView;
