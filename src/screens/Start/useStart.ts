import { KEY_STORAGE_LOGGED_IN_USER, KEY_STORAGE_STORED_USERS } from '@/constants';
import { Dispatch } from '@/store';
import { User } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';

const useStart = () => {
  const dispatch = useDispatch<Dispatch>();

  const getLoggedInUser = async () => {
    const userCred = await AsyncStorage.getItem(KEY_STORAGE_LOGGED_IN_USER);
    return userCred !== null ? (JSON.parse(userCred) as User) : null;
  };

  const getStoredUsers = async () => {
    const userCreds = await AsyncStorage.getItem(KEY_STORAGE_STORED_USERS);
    return userCreds !== null ? (JSON.parse(userCreds) as User[]) : null;
  };

  const loadUser = (user: User) => {
    dispatch.users.setUser(user);
    AsyncStorage.setItem(KEY_STORAGE_LOGGED_IN_USER, JSON.stringify(user));
  };

  return { getLoggedInUser, getStoredUsers, loadUser };
};

export default useStart;
