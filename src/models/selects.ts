import api from '@/services';
import { getTaskById } from '@/services/firestore';
import { Classroom, Enroll, SubmissionInfo } from '@/types';
import { createModel } from '@rematch/core';
import { isEqual, startOfToday, startOfYesterday } from 'date-fns';
import { RootModel } from '.';

interface State {
  classrooms: Classroom[];
  classroom: Classroom | null;
  enrollees: Enroll[];
  enrollee: Enroll | null;
  dailyTaskSubmissions: SubmissionInfo[];
  submissions: SubmissionInfo[];
  currentSubmission: SubmissionInfo | null;
  previousSubmission: SubmissionInfo | null;
}

export const selects = createModel<RootModel>()({
  state: {
    classrooms: [],
    classroom: null,
    enrollees: [],
    enrollee: null,
    submissions: [],
    dailyTaskSubmissions: [],
    previousSubmission: null,
    currentSubmission: null,
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
        enrollees: [],
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
        submissions: [],
      };
    },
    setSubmissions(state, payload: SubmissionInfo[]) {
      return {
        ...state,
        submissions: payload,
      };
    },
    setDailyTaskSubmissions(state, payload: SubmissionInfo[]) {
      return {
        ...state,
        dailyTaskSubmissions: payload,
      };
    },
    setPreviousSubmission(state, payload: SubmissionInfo | null) {
      return {
        ...state,
        previousSubmission: payload,
      };
    },
    setCurrentSubmission(state, payload: SubmissionInfo | null) {
      return {
        ...state,
        currentSubmission: payload,
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
        dispatch.selects.setClassrooms(classrooms);
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
        if (user.type !== 'teacher') {
          throw new Error('User must be a teacher to create classrooms!');
        }

        await api.firestore.createClassroom(user.id, name);
        await dispatch.selects.fetchClassrooms();
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
        if (user.type !== 'student') {
          throw new Error('User must be a student to create classrooms');
        }

        await api.firestore.joinClassroom(user.id, code);
        await dispatch.selects.fetchClassrooms();
      } catch (error) {
        alert(error);
      }
    },
    async fetchEnrollees(_: void, state) {
      try {
        const classroom = state.selects.classroom;
        if (!classroom) {
          throw new Error('No classroom selected!');
        }

        const enrollees = await api.firestore.getClassroomEnrolls(classroom.id);
        dispatch.selects.setEnrollees(enrollees);
      } catch (error) {
        alert(error);
      }
    },
    async fetchEnrolleeSubmissions(_: void, state) {
      try {
        const enrollee = state.selects.enrollee;
        if (!enrollee) {
          throw new Error('No enrollee selected!');
        }

        const { student } = enrollee;
        const submissions = await api.firestore.getUserSubmissions(student.id);
        dispatch.selects.setSubmissions(submissions);
      } catch (error) {
        alert(error);
      }
    },
    async fetchDailyTaskSubmissions(_: void, state) {
      try {
        const dailyTask = state.tasks.task;
        if (!dailyTask) {
          throw new Error('No daily task found!');
        }

        const submissions = await api.firestore.getTaskSubmissions(dailyTask.id);

        dispatch.selects.setDailyTaskSubmissions(submissions);
      } catch (error) {
        alert(error);
      }
    },
    async fetchUserSubmissions(_: void, state) {
      try {
        const user = state.users.user;
        if (!user) {
          throw new Error('No user found!');
        }

        const submissions = await api.firestore.getUserSubmissions(user.id, 2);
        const previousSubmission = submissions.find((submission) =>
          isEqual(submission.task.submissionDate, startOfYesterday())
        );
        const currentSubmission = submissions.find((submission) =>
          isEqual(submission.task.submissionDate, startOfToday())
        );

        if (previousSubmission) {
          dispatch.selects.setPreviousSubmission(previousSubmission);
        }

        if (currentSubmission) {
          dispatch.selects.setCurrentSubmission(currentSubmission);
        }
      } catch (error) {
        alert(error);
      }
    },
  }),
});
