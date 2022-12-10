import api from '@/services';
import { getTaskById } from '@/services/firestore';
import { Classroom, Enroll, SubmissionInfo } from '@/types';
import { createModel } from '@rematch/core';
import { RootModel } from '.';

interface State {
  classrooms: Classroom[];
  classroom: Classroom | null;
  enrollees: Enroll[];
  enrollee: Enroll | null;
  submissions: SubmissionInfo[];
}

export const classrooms = createModel<RootModel>()({
  state: {
    classrooms: [],
    classroom: null,
    enrollees: [],
    enrollee: null,
    submissions: [],
  } as State,
  reducers: {
    setClassrooms(state, payload: Classroom[]) {
      return {
        ...state,
        classrooms: payload,
      };
    },
    setClassroom(state, payload: Classroom | null) {
      return {
        ...state,
        classroom: payload,
      };
    },
    setEnrollees(state, payload: Enroll[]) {
      return {
        ...state,
        enrollees: payload,
      };
    },
    setEnrollee(state, payload: Enroll | null) {
      return {
        ...state,
        enrollee: payload,
      };
    },
    setSubmissions(state, payload: SubmissionInfo[]) {
      return {
        ...state,
        submissions: payload,
      };
    },
  },
  effects: (dispatch) => ({
    async fetchClassrooms(_: void, state) {
      try {
        const user = state.users.user;

        if (!user) {
          throw new Error('No user selected!');
        }

        const isUserTeacher = user.type === 'teacher';

        const classrooms = isUserTeacher
          ? await api.firestore.getTeacherClassrooms(user.id)
          : await api.firestore.getStudentClassrooms(user.id);
        dispatch.classrooms.setClassrooms(classrooms);
      } catch (error) {
        alert(error);
      }
    },
    async createClassroom(name: string, state) {
      try {
        const user = state.users.user;

        if (!user) {
          throw new Error('No user selected!');
        }

        await api.firestore.createClassroom(user.id, name);
        await dispatch.classrooms.fetchClassrooms();
      } catch (error) {
        alert(error);
      }
    },
    async joinClassroom(code: string, state) {
      try {
        const user = state.users.user;

        if (!user) {
          throw new Error('No user selected!');
        }

        await api.firestore.joinClassroom(user.id, code);
        await dispatch.classrooms.fetchClassrooms();
      } catch (error) {
        alert(error);
      }
    },
    async fetchEnrollees(_: void, state) {
      try {
        const classroom = state.classrooms.classroom;
        if (!classroom) {
          throw new Error('No classroom selected!');
        }

        const enrollees = await api.firestore.getClassroomEnrolls(classroom.id);
        dispatch.classrooms.setEnrollees(enrollees);
      } catch (error) {
        alert(error);
      }
    },
    async fetchSubmissions(_: void, state) {
      try {
        const enrollee = state.classrooms.enrollee;
        if (!enrollee) {
          throw new Error('No enrollee selected!');
        }

        const { student } = enrollee;
        const submissions = await api.firestore.getUserSubmissions(student.id);
        dispatch.classrooms.setSubmissions(submissions);
      } catch (error) {
        alert(error);
      }
    },
    async fetchGrades(taskId: string) {
      try {
        const task = await getTaskById(taskId);
      } catch (error) {
        alert(error);
      }
    },
  }),
});
