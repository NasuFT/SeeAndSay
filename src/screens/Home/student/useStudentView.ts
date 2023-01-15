import { useDispatch, useSelector } from 'react-redux';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { Dispatch, RootState } from '@/store';
import { Classroom, JoinClassroomFormData, SubmissionInfo, Task } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import { getStudentClassrooms, getUserSubmissions, joinClassroomByCode } from '@/api';
import { isEqual, startOfToday, startOfYesterday } from 'date-fns';

const classroomFormSchema: yup.ObjectSchema<JoinClassroomFormData> = yup
  .object({
    code: yup.string().required().length(10).label('Classroom Code'),
  })
  .required();

const useStudentView = () => {
  const dispatch = useDispatch<Dispatch>();

  // user data
  const user = useSelector((state: RootState) => state.users.user);

  // daily task
  const dailyTask = useSelector((state: RootState) => state.tasks.task);
  const getDailyTask = dispatch.tasks.getDailyTask;

  // submissions
  const [previousSubmission, setPreviousSubmission] = useState<SubmissionInfo | null>(null);
  const [currentSubmission, setCurrentSubmission] = useState<SubmissionInfo | null>(null);
  const getRecentSubmissions = useCallback(async () => {
    if (!user) {
      return;
    }

    const submissions = await getUserSubmissions(user.id, 2);
    const previousSubmission = submissions.find((submission) =>
      isEqual(submission.task.submissionDate, startOfYesterday())
    );
    const currentSubmission = submissions.find((submission) =>
      isEqual(submission.task.submissionDate, startOfToday())
    );

    if (previousSubmission) {
      setPreviousSubmission(previousSubmission);
    }

    if (currentSubmission) {
      setCurrentSubmission(currentSubmission);
    }
  }, [user]);

  // playable

  const [isPlayable, setIsPlayable] = useState(false);

  useEffect(() => {
    if (!dailyTask) {
      return;
    }

    if (!currentSubmission || currentSubmission.task.id !== dailyTask.id) {
      setIsPlayable(true);
      return;
    }

    setIsPlayable(false);
  }, [currentSubmission, dailyTask]);

  // classroom list logic
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const getClassrooms = useCallback(async () => {
    if (!user) {
      return [];
    }

    const classrooms = await getStudentClassrooms(user.id);
    setClassrooms(classrooms);
  }, [user]);

  // join classroom logic

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<JoinClassroomFormData>({
    resolver: yupResolver(classroomFormSchema),
  });

  const handleUserJoinClassroom = useCallback(
    (onSubmit?: (data: JoinClassroomFormData) => void | Promise<void>) => {
      if (!user) {
        return () => {};
      }

      const onSubmitForm: SubmitHandler<JoinClassroomFormData> = async (data) => {
        await joinClassroomByCode(user.id, data.code);
        if (onSubmit) {
          await onSubmit?.(data);
        }
      };

      return handleSubmit(onSubmitForm);
    },
    [user]
  );

  const isJoiningClassroom = isSubmitting;

  return {
    control,
    classrooms,
    getClassrooms,
    handleUserJoinClassroom,
    isJoiningClassroom,
    dailyTask,
    getDailyTask,
    isPlayable,
    getRecentSubmissions,
    previousSubmission,
    currentSubmission,
  };
};

export default useStudentView;
