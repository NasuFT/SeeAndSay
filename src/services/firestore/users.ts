import { User } from '@/types';
import firestore from '@react-native-firebase/firestore';
import { USERS_COLLECTION } from '../constants';

export const getUserData = async (uid: string) => {
  const query = await firestore().collection(USERS_COLLECTION).where('id', '==', uid).get();

  if (query.size < 1) {
    throw new Error(`No documents found for user ID ${uid}`);
  } else if (query.size > 1) {
    throw new Error(`Unreachable. Multiple users found with ID ${uid}`);
  }

  const document = query.docs[0];
  const data = document.data() as User;

  return data;
};

export const addUserData = async (user: User) => {
  const document = await firestore().collection(USERS_COLLECTION).add(user);

  return document.id;
};
