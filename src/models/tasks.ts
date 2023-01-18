import { uploadTaskSubmission } from '@/api';
import { getTask } from '@/api/tasks';
import api from '@/services';
import { downloadFiles } from '@/services/filesystem';
import { SubmissionData, Task } from '@/types';
import { createModel } from '@rematch/core';
import { RootModel } from '.';

interface Submission {
  time: number;
  data: SubmissionData;
}

interface State {
  task: Task | null;
  imageSources: string[];
  submission: Submission;
}

export const tasks = createModel<RootModel>()({
  state: {
    task: null,
    imageSources: [],
    submission: {
      time: -1,
      data: [],
    },
  } as State,
  reducers: {
    setTask(state, payload: Task | null) {
      return {
        ...state,
        task: payload,
        imageSources: payload === null ? [] : state.imageSources,
        submission: {
          time: -1,
          data: [],
        },
      };
    },
    setImageSources(state, payload: string[]) {
      return {
        ...state,
        imageSources: payload,
      };
    },
    setSubmission(state, payload: Submission) {
      return {
        ...state,
        submission: {
          time: payload.time,
          data: payload.data,
        },
      };
    },
    clearSubmission(state) {
      return {
        ...state,
        submission: {
          time: -1,
          data: [],
        },
      };
    },
  },
  effects: (dispatch) => ({
    async getDailyTask() {
      try {
        const task = await getTask();
        dispatch.tasks.setTask(task);
      } catch (error) {
        if (__DEV__) {
          console.log(error);
        }
        alert(error);
      }
    },
    async getImageSources(_: void, state) {
      try {
        if (!state.tasks.task) {
          throw new Error('No task selected!');
        }

        const { game } = state.tasks.task;
        const { type, data } = game;

        if (type === 'fourpicsoneword') {
          const imageSources = data.flatMap((item) => item.imgSources);
          const fileURIs = await downloadFiles(imageSources);
          dispatch.tasks.setImageSources(fileURIs);
        } else {
          const imageSources = data.map((item) => item.imgSource);
          const fileURIs = await downloadFiles(imageSources);
          dispatch.tasks.setImageSources(fileURIs);
        }
      } catch (error) {
        if (__DEV__) {
          console.log(error);
        }
        alert(error);
      }
    },
    async uploadSubmission(_: void, state) {
      try {
        const task = state.tasks.task;
        const user = state.users.user;
        const submissionInfo = state.tasks.submission;

        if (!task) {
          throw new Error('No task selected!');
        }
        if (!user) {
          throw new Error('No user selected!');
        }

        await uploadTaskSubmission(user.id, task.id, submissionInfo);
        dispatch.tasks.clearSubmission();
      } catch (error) {
        if (__DEV__) {
          console.log(error);
        }
        alert(error);
      }
    },
  }),
});
