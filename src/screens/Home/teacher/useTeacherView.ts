import { useDispatch, useSelector } from 'react-redux';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { Dispatch, RootState } from '@/store';
import { Classroom, CreateClassroomFormData } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import { createClassroom, getTeacherClassrooms } from '@/api';

const classroomFormSchema: yup.ObjectSchema<CreateClassroomFormData> = yup
  .object({
    name: yup.string().required().label('Classroom Name'),
  })
  .required();

const useTeacherView = () => {
  const dispatch = useDispatch<Dispatch>();

  // const classrooms = useSelector((state: RootState) => state.selects.classrooms);

  // const fetchClassrooms = dispatch.selects.fetchClassrooms;

  // // const onSubmitForm: SubmitHandler<CreateClassroomFormData> = async (data) => {
  // //   await dispatch.selects.createClassroom(data.name);
  // // };
  // // const handleUserCreateClassroom = handleSubmit(onSubmitForm);

  // const isCreatingClassroom = isSubmitting;

  // const classroom = useSelector((state: RootState) => state.selects.classroom);
  // const selectClassroom = dispatch.selects.setClassroom;

  // useEffect(() => {
  //   dispatch.tasks.fetchDailyTask();
  // }, []);

  // user
  const user = useSelector((state: RootState) => state.users.user);

  // classroom list logic
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const getClassrooms = useCallback(async () => {
    if (!user) {
      return [];
    }

    const classrooms = await getTeacherClassrooms(user.id);
    setClassrooms(classrooms);
  }, [user]);

  // create classroom logic

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CreateClassroomFormData>({
    resolver: yupResolver(classroomFormSchema),
  });

  const handleUserCreateClassroom = useCallback(
    (onSubmit?: (data: CreateClassroomFormData) => void | Promise<void>) => {
      if (!user) {
        return () => {};
      }

      const onSubmitForm: SubmitHandler<CreateClassroomFormData> = async (data) => {
        await createClassroom(user.id, data.name);
        if (onSubmit) {
          await onSubmit?.(data);
        }
      };

      return handleSubmit(onSubmitForm);
    },
    [user]
  );

  const isCreatingClassroom = isSubmitting;

  return {
    control,
    classrooms,
    getClassrooms,
    handleUserCreateClassroom,
    isCreatingClassroom,
  };
};

export default useTeacherView;
