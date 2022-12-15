import api from '@/services';
import { Dispatch, RootState } from '@/store';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useTeacherView = () => {
  const dispatch = useDispatch<Dispatch>();

  const enrollees = useSelector((state: RootState) => state.classrooms.enrollees);
  const fetchEnrolls = dispatch.classrooms.fetchEnrollees;
  const setEnrollee = dispatch.classrooms.setEnrollee;

  const dailyTaskSubmissions = useSelector(
    (state: RootState) => state.classrooms.dailyTaskSubmissions
  );
  const fetchGrades = dispatch.classrooms.fetchDailyTaskSubmissions;

  const grades = useMemo(
    () => dailyTaskSubmissions.map((submission) => submission.grade),
    [dailyTaskSubmissions]
  );

  return { enrollees, fetchEnrolls, setEnrollee, fetchGrades, grades };
};

export default useTeacherView;
