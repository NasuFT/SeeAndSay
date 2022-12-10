import { Dispatch, RootState } from '@/store';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useTeacherView = () => {
  const dispatch = useDispatch<Dispatch>();

  const enrollees = useSelector((state: RootState) => state.classrooms.enrollees);
  const fetchEnrolls = dispatch.classrooms.fetchEnrollees;
  const setEnrollee = dispatch.classrooms.setEnrollee;

  const submissions = useSelector((state: RootState) => state.classrooms.submissions);
  const fetchGrades = dispatch.classrooms.fetchGrades;

  const grades = useMemo(() => submissions.map((submission) => submission.grade), [submissions]);

  return { enrollees, fetchEnrolls, setEnrollee, fetchGrades, grades };
};

export default useTeacherView;
