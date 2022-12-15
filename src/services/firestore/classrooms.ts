import { Classroom, Enroll } from '@/types';
import { generateCode } from '@/utils/helper';
import firestore from '@react-native-firebase/firestore';
import { chunk } from 'lodash';
import { CLASSROOMS_COLLECTION, ENROLLS_COLLECTION } from '../constants';
import { getUserData } from './users';

export const getTeacherClassrooms = async (uid: string) => {
  const query = await firestore()
    .collection(CLASSROOMS_COLLECTION)
    .where('teacher.id', '==', uid)
    .get();

  const documents = query.docs;
  const data = documents.map((document) => {
    const data = document.data();
    const classroom = {
      ...data,
      timestamp: data.timestamp.toDate(),
    } as Classroom;
    return classroom;
  });

  return data;
};

export const createClassroom = async (uid: string, name: string) => {
  const user = await getUserData(uid);
  const document = firestore().collection(CLASSROOMS_COLLECTION).doc();

  const newClassroom: Classroom = {
    id: document.id,
    name,
    code: generateCode(),
    // @ts-ignore: Technically a date
    timestamp: firestore.FieldValue.serverTimestamp(),
    teacher: {
      id: uid,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  };

  await document.set(newClassroom);

  return document.id;
};

const getClassroomFromCode = async (code: string) => {
  const documents = (
    await firestore().collection(CLASSROOMS_COLLECTION).where('code', '==', code).get()
  ).docs;

  if (documents.length <= 0) {
    throw new Error('No classroom found for given code');
  }

  const data = documents[0].data();

  const classroom = {
    ...data,
    timestamp: data.timestamp.toDate(),
  } as Classroom;

  return classroom;
};

export const joinClassroom = async (uid: string, code: string) => {
  const user = await getUserData(uid);
  const classroom = await getClassroomFromCode(code);

  const document = firestore().collection(ENROLLS_COLLECTION).doc();
  const newEnroll: Enroll = {
    id: document.id,
    classroomId: classroom.id,
    student: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    // @ts-ignore: Technically a date
    timestamp: firestore.FieldValue.serverTimestamp(),
  };

  await document.set(newEnroll);
  return document.id;
};

export const getStudentClassrooms = async (uid: string) => {
  const enrollsQuery = await firestore()
    .collection(ENROLLS_COLLECTION)
    .where('student.id', '==', uid)
    .get();
  const enrolls = enrollsQuery.docs.map((document) => document.data() as Enroll);
  const classroomIds = enrolls.map((item) => item.classroomId);

  // chunking due to limitation of 10 where conditions per query
  const chunkedClassroomIds = chunk(classroomIds, 10);
  const queries = await Promise.all(
    chunkedClassroomIds.map(async (arr) => {
      const query = await firestore()
        .collection(CLASSROOMS_COLLECTION)
        .where('id', 'in', arr)
        .get();

      const classrooms = query.docs.map((document) => {
        const data = document.data();
        const classroom = {
          ...data,
          timestamp: data.timestamp.toDate(),
        } as Classroom;
        return classroom;
      });
      return classrooms;
    })
  );
  const classrooms = queries.flat();
  return classrooms;
};

export const getClassroomEnrolls = async (classroomId: string) => {
  const enrollsQuery = await firestore()
    .collection(ENROLLS_COLLECTION)
    .where('classroomId', '==', classroomId)
    .get();

  const documents = enrollsQuery.docs;
  const data = documents.map((document) => {
    const data = document.data();
    const enroll = {
      ...data,
      timestamp: data.timestamp.toDate(),
    } as Enroll;
    return enroll;
  });

  return data;
};
