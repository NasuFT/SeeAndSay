import { useDispatch, useSelector } from 'react-redux';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { Dispatch, RootState } from '@/store';
import { Classroom, CreateClassroomFormData } from '@/types';

const classroomFormSchema: yup.ObjectSchema<CreateClassroomFormData> = yup
  .object({
    name: yup.string().required().label('Classroom Name'),
  })
  .required();

const useTeacherView = () => {
  const { control, handleSubmit } = useForm<CreateClassroomFormData>({
    resolver: yupResolver(classroomFormSchema),
  });

  const classrooms = useSelector((state: RootState) => state.classrooms.classrooms);

  const dispatch = useDispatch<Dispatch>();

  const fetchClassrooms = dispatch.classrooms.fetchClassrooms;

  const onSubmitForm: SubmitHandler<CreateClassroomFormData> = async (data) => {
    await dispatch.classrooms.createClassroom(data.name);
  };
  const handleUserCreateClassroom = handleSubmit(onSubmitForm);

  const isCreatingClassroom = useSelector(
    (state: RootState) => state.loading.effects.classrooms.createClassroom
  );

  const classroom = useSelector((state: RootState) => state.classrooms.classroom);
  const selectClassroom = dispatch.classrooms.setClassroom;

  return {
    control,
    classrooms,
    fetchClassrooms,
    handleUserCreateClassroom,
    isCreatingClassroom,
    classroom,
    selectClassroom,
  };
};

export default useTeacherView;
