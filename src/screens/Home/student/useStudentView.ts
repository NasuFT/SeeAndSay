import { useDispatch, useSelector } from 'react-redux';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { Dispatch, RootState } from '@/store';
import { JoinClassroomFormData } from '@/types';
import { useCallback, useState } from 'react';
import api from '@/services';

const classroomFormSchema: yup.ObjectSchema<JoinClassroomFormData> = yup
  .object({
    code: yup.string().required().length(10).label('Classroom Code'),
  })
  .required();

const useStudentView = () => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<JoinClassroomFormData>({
    resolver: yupResolver(classroomFormSchema),
  });
  const dispatch = useDispatch<Dispatch>();

  const user = useSelector((state: RootState) => state.users.user);

  const classrooms = useSelector((state: RootState) => state.selects.classrooms);
  const fetchClassrooms = dispatch.selects.fetchClassrooms;

  // const onSubmitForm: SubmitHandler<JoinClassroomFormData> = async (data) => {
  //   await dispatch.selects.joinClassroom(data.code);
  // };
  // const handleUserJoinClassroom = handleSubmit(onSubmitForm);

  const handleUserJoinClassroom = (
    onSubmit?: (data: JoinClassroomFormData) => void | Promise<void>
  ) => {
    const onSubmitForm: SubmitHandler<JoinClassroomFormData> = async (data) => {
      await dispatch.selects.joinClassroom(data.code);
      if (onSubmit) {
        await onSubmit?.(data);
      }
    };

    return handleSubmit(onSubmitForm);
  };

  const isCreatingClassroom = isSubmitting;

  const dailyTask = useSelector((state: RootState) => state.tasks.task);
  const fetchDailyTask = dispatch.tasks.fetchDailyTask;

  const [canSubmit, setCanSubmit] = useState(false);

  const checkSubmissions = useCallback(() => {
    if (!dailyTask || !user) {
      return;
    }

    const cb = async () => {
      const { count } = await api.firestore.countUserTaskSubmissions(user.id, dailyTask.id);

      if (count > 0) {
        setCanSubmit(false);
      } else {
        setCanSubmit(true);
      }
    };

    cb();
  }, [dailyTask, user]);

  return {
    control,
    classrooms,
    fetchClassrooms,
    handleUserJoinClassroom,
    isCreatingClassroom,
    dailyTask,
    fetchDailyTask,
    canSubmit,
    checkSubmissions,
  };
};

export default useStudentView;
