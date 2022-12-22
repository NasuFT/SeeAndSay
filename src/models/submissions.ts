import api from '@/services';
import { createModel } from '@rematch/core';
import { RootModel } from '.';

interface State {
  data: any[];
  time: number;
}

export const submissions = createModel<RootModel>()({
  state: { data: [], time: -1 } as State,
  reducers: {
    setSubmission(state, payload: any[]) {
      return {
        ...state,
        data: payload,
      };
    },
    setTime(state, payload: number) {
      return {
        ...state,
        time: payload,
      };
    },
  },
  effects: (dispatch) => ({
    async uploadSubmission(_: void, state) {
      try {
        const task = state.tasks.task;
        const user = state.users.user;
        const data = state.submissions.data;
        const time = state.submissions.time;

        if (!task) {
          throw new Error('No task selected!');
        }
        if (!user) {
          throw new Error('No user selected!');
        }

        const id = await api.firestore.createTaskSubmission({
          taskId: task.id,
          userId: user.id,
          data,
          time,
        });
        dispatch.submissions.setSubmission([]);
        dispatch.submissions.setTime(-1);
        const submission = await api.firestore.getSubmissionById(id);
        dispatch.selects.setCurrentSubmission(submission);
      } catch (error) {
        alert(error);
      }
    },
  }),
});
