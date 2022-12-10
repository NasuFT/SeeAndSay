import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { RegisterFormData } from '@/types';
import { useDispatch } from 'react-redux';
import { Dispatch } from '@/store';

const registerFormSchema: yup.ObjectSchema<RegisterFormData> = yup
  .object({
    firstName: yup.string().required().label('First Name'),
    lastName: yup.string().required().label('Last Name'),
    email: yup.string().email().required().label('Email'),
    password: yup.string().min(8).required().label('Password'),
    type: yup.string<RegisterFormData['type']>().required().label('User Type'),
  })
  .required();

const useRegisterContainer = () => {
  const { control, handleSubmit } = useForm<RegisterFormData>({
    resolver: yupResolver(registerFormSchema),
  });

  const dispatch = useDispatch<Dispatch>();
  const onSubmitForm: SubmitHandler<RegisterFormData> = async (data) => {
    await dispatch.users.signUp(data);
  };
  const handleRegisterPress = handleSubmit(onSubmitForm);

  return { control, handleRegisterPress };
};

export default useRegisterContainer;
