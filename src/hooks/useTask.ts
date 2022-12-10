import { Task } from '@/types';
import {  useMemo } from 'react';

const useTask = (task: Task) => {
  const game = useMemo(() => task.game, [task.game]);
  const { type } = game;

  const fetchImages = useMemo(
    () =>
      type === 'classic'
        ? () => {}
        : type === 'describeme'
        ? () => {}
        : // type === 'fourpicsoneword'
          () => {},
    [type]
  );

  return { game, type, fetchImages };
};

export default useTask;
