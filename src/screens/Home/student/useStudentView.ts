import { useDispatch, useSelector } from 'react-redux';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { Dispatch, RootState } from '@/store';
import { Classroom, JoinClassroomFormData } from '@/types';
import { useEffect } from 'react';

const classroomFormSchema: yup.ObjectSchema<JoinClassroomFormData> = yup
  .object({
    code: yup.string().required().length(10).label('Classroom Code'),
  })
  .required();

const useStudentView = () => {
  const { control, handleSubmit } = useForm<JoinClassroomFormData>({
    resolver: yupResolver(classroomFormSchema),
  });
  const dispatch = useDispatch<Dispatch>();

  const classrooms = useSelector((state: RootState) => state.classrooms.classrooms);
  const fetchClassrooms = dispatch.classrooms.fetchClassrooms;

  const onSubmitForm: SubmitHandler<JoinClassroomFormData> = async (data) => {
    await dispatch.classrooms.joinClassroom(data.code);
  };
  const handleUserJoinClassroom = handleSubmit(onSubmitForm);

  const isCreatingClassroom = useSelector(
    (state: RootState) => state.loading.effects.classrooms.joinClassroom
  );

  const selectClassroom = dispatch.classrooms.setClassroom;

  const dailyTask = useSelector((state: RootState) => state.tasks.task);
  const fetchDailyTask = dispatch.tasks.fetchDailyTask;

  return {
    control,
    classrooms,
    fetchClassrooms,
    handleUserJoinClassroom,
    isCreatingClassroom,
    selectClassroom,
    dailyTask,
    fetchDailyTask,
  };
};

export default useStudentView;
