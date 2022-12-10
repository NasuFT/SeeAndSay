import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { LoginFormData } from '@/types';
import { Dispatch } from '@/store';

const loginFormSchema = yup
  .object({
    email: yup.string().email().required().label('Email'),
    password: yup.string().min(8).required().label('Password'),
  })
  .required();

const useLoginContainer = () => {
  const dispatch = useDispatch<Dispatch>();
  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: yupResolver(loginFormSchema),
  });

  const onSubmitForm: SubmitHandler<LoginFormData> = async (data) => {
    await dispatch.users.signIn(data);
  };
  const handleLoginPress = handleSubmit(onSubmitForm);

  return { control, handleLoginPress };
};

export default useLoginContainer;
