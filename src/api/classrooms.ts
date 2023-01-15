import { Classroom, Enroll, User } from '@/types';
import { generateCode } from '@/utils/helper';
import firestore from '@react-native-firebase/firestore';
import { chunk } from 'lodash';
import { CLASSROOMS_COLLECTION, ENROLLS_COLLECTION, USERS_COLLECTION } from './constants';
import { getUserData } from './users';

export const getClassroomByID = async (id: string) => {
  const collection = firestore().collection(CLASSROOMS_COLLECTION);
  const query = collection.where('id', '==', id);
  const snapshot = await query.get();

  if (snapshot.empty) {
    throw new Error(`No classroom found with ID ${id}`);
  }

  const { timestamp, ...data } = snapshot.docs[0].data();
  const classroom = data as Classroom;
  return classroom;
};

export const getTeacherClassrooms = async (userId: string) => {
  const collection = firestore().collection(CLASSROOMS_COLLECTION);
  const query = collection.where('teacher.id', '==', userId);
  const snapshot = await query.get();

  const data = snapshot.docs.map((document) => {
    const data = document.data();
    const { timestamp, ...classroom } = data;
    return classroom as Classroom;
  });

  return data;
};

export const getEnrolledStudents = async (classroomId: string) => {
  const enrollsCollection = firestore().collection(ENROLLS_COLLECTION);
  const usersCollection = firestore().collection(USERS_COLLECTION);

  const enrollsQuery = enrollsCollection.where('classroomId', '==', classroomId);
  const enrollsSnapshot = await enrollsQuery.get();
  const studentIds = enrollsSnapshot.docs.map((document) => {
    const enroll = document.data() as Enroll;
    return enroll.student.id;
  });

  const chunkedStudentIds = chunk(studentIds, 10);
  const userQueries = await Promise.all(
    chunkedStudentIds.map(async (userIds) => {
      const query = usersCollection.where('id', 'in', userIds);
      const snapshot = await query.get();

      const users = snapshot.docs.map((document) => document.data() as User);
      return users;
    })
  );

  const users = userQueries.flat();
  return users;
};

export const getStudentClassrooms = async (userId: string) => {
  const enrollsCollection = firestore().collection(ENROLLS_COLLECTION);
  const classroomsCollection = firestore().collection(CLASSROOMS_COLLECTION);

  const enrollsQuery = enrollsCollection.where('student.id', '==', userId);
  const enrollsSnapshot = await enrollsQuery.get();
  const classroomIds = enrollsSnapshot.docs.map((document) => {
    const enroll = document.data() as Enroll;
    return enroll.classroomId;
  });

  const chunkedClassroomIds = chunk(classroomIds, 10);
  const classroomQueries = await Promise.all(
    chunkedClassroomIds.map(async (classroomIds) => {
      const query = classroomsCollection.where('id', 'in', classroomIds);
      const snapshot = await query.get();

      const classrooms = snapshot.docs.map((document) => {
        const { timestamp, ...classroom } = document.data();
        return classroom as Classroom;
      });

      return classrooms;
    })
  );

  return classroomQueries.flat();
};

export const createClassroom = async (userId: string, name: string) => {
  const collection = firestore().collection(CLASSROOMS_COLLECTION);
  const user = await getUserData(userId);

  const document = collection.doc();

  const data = {
    id: document.id,
    name,
    code: generateCode(),
    timestamp: firestore.FieldValue.serverTimestamp(),
    teacher: {
      id: userId,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  };

  await document.set(data);
};

const getClassroomIDFromCode = async (code: string) => {
  const collection = firestore().collection(CLASSROOMS_COLLECTION);
  const query = collection.where('code', '==', code);
  const snapshot = await query.get();

  if (snapshot.empty) {
    throw new Error(`No classroom found with code ${code}`);
  }

  return snapshot.docs[0].id;
};

export const joinClassroomByCode = async (userId: string, code: string) => {
  const user = await getUserData(userId);
  const id = await getClassroomIDFromCode(code);

  const collection = firestore().collection(ENROLLS_COLLECTION);
  const data = {
    classroomId: id,
    student: {
      id: userId,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    timestamp: firestore.FieldValue.serverTimestamp(),
  };

  await collection.add(data);
};
