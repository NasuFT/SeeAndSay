import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Dispatch, RootState } from '@/store';
import { SubmissionInfo, User } from '@/types';
import { getEnrolledStudents, getTaskSubmissionsByClassroomID } from '@/api';

const useTeacherView = () => {
  const dispatch = useDispatch<Dispatch>();

  // daily task
  const dailyTask = useSelector((state: RootState) => state.tasks.task);
  const getDailyTask = dispatch.tasks.getDailyTask;

  // enrolled students logic
  const [students, setStudents] = useState<User[]>([]);
  const getStudents = async (classroomId: string) => {
    const students = await getEnrolledStudents(classroomId);
    setStudents(students);
  };

  // submissions logic
  const [submissions, setSubmissions] = useState<SubmissionInfo[]>([]);
  const getSubmissions = async (taskId: string, classroomId: string) => {
    const submissions = await getTaskSubmissionsByClassroomID(taskId, classroomId);
    setSubmissions(submissions);
  };

  return { students, getStudents, getSubmissions, submissions, dailyTask, getDailyTask };
};

export default useTeacherView;
