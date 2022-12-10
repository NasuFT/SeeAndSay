import auth from '@react-native-firebase/auth';

export const signIn = async (email: string, password: string) => {
  const { user } = await auth().signInWithEmailAndPassword(email, password);

  return user.uid;
};

export const signUp = async (email: string, password: string) => {
  const { user } = await auth().createUserWithEmailAndPassword(email, password);

  return user.uid;
};

export const signOut = async () => {
  await auth().signOut();
};
