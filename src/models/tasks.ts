import api from '@/services';
import { downloadFiles } from '@/services/filesystem';
import { Task } from '@/types';
import { createModel } from '@rematch/core';
import { RootModel } from '.';

interface State {
  task: Task | null;
  imageSources: string[];
}

export const tasks = createModel<RootModel>()({
  state: {
    task: null,
    imageSources: [],
  } as State,
  reducers: {
    setTask(state, payload: Task | null) {
      return {
        ...state,
        task: payload,
        imageSources: payload === null ? [] : state.imageSources,
      };
    },
    setImageSources(state, payload: string[]) {
      return {
        ...state,
        imageSources: payload,
      };
    },
  },
  effects: (dispatch) => ({
    async fetchDailyTask() {
      try {
        const dailyTask = await api.firestore.getDailyTask();
        dispatch.tasks.setTask(dailyTask);
      } catch (error) {
        alert(error);
      }
    },
    async fetchImageSources(task: Task) {
      if (!task) {
        throw new Error('No task selected!');
      }

      const game = task.game;
      const { type, data } = game;

      if (type === 'classic') {
        const imageSources = data.map((item) => item.imgSource);
        const fileURIs = await downloadFiles(imageSources);

        dispatch.tasks.setImageSources(fileURIs);
        return fileURIs;
      } else if (type === 'fourpicsoneword') {
        const imageSources = data.flatMap((item) => item.imgSources);
        const fileURIs = await downloadFiles(imageSources);

        dispatch.tasks.setImageSources(fileURIs);
        return fileURIs;
      } else if (type === 'describeme') {
        const imageSources = data.map((item) => item.imgSource);
        const fileURIs = await downloadFiles(imageSources);

        dispatch.tasks.setImageSources(fileURIs);
      } else if (type === 'puzzle') {
        const imageSources = data.map((item) => item.imgSource);
        const fileURIs = await downloadFiles(imageSources);

        dispatch.tasks.setImageSources(fileURIs);
        return fileURIs;
      } else if (type === 'scavengerhunt') {
        const imageSources = data.map((item) => item.imgSource);
        const fileURIs = await downloadFiles(imageSources);

        dispatch.tasks.setImageSources(fileURIs);
      }
    },
  }),
});
