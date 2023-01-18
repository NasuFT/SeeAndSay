import { User } from '@/types';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { pick } from 'lodash';
import { USERS_COLLECTION } from './constants';

export const getUserData = async (id: string) => {
  const query = await firestore().collection(USERS_COLLECTION).where('id', '==', id).get();

  if (query.size < 1) {
    throw new Error(`No documents found for user ID ${id}`);
  } else if (query.size > 1) {
    throw new Error(`Unreachable. Multiple users found with ID ${id}`);
  }

  return query.docs[0].data() as User;
};

const addUserData = async (data: User) => {
  await firestore().collection(USERS_COLLECTION).add(data);
};

export const signIn = async (email: string, password: string) => {
  const { user } = await auth().signInWithEmailAndPassword(email, password);
  const firestoreUser = await getUserData(user.uid);

  return firestoreUser;
};

interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  type: User['type'];
}

export const signUp = async (data: SignUpData) => {
  const { user } = await auth().createUserWithEmailAndPassword(data.email, data.password);

  const userData: User = {
    ...pick(data, ['email', 'firstName', 'lastName', 'type']),
    id: user.uid,
  };

  await addUserData(userData);

  return userData;
};

export const signOut = async () => {
  await auth().signOut();
};
