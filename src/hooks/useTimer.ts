import { addMilliseconds, differenceInMilliseconds } from 'date-fns';
import { now } from 'lodash';
import { useCallback, useRef, useState } from 'react';

interface TimerOptions {
  onTimerStop?: () => void;
  onTimerStart?: () => void;
}

const useTimer = (milliseconds: number, options: TimerOptions = {}) => {
  const [time, setTime] = useState(milliseconds);
  const timer = useRef<NodeJS.Timeout>();
  const targetTime = useRef(addMilliseconds(now(), milliseconds));

  const updateTimer = () => {
    const time = differenceInMilliseconds(targetTime.current, now());
    setTime(time);

    if (time <= 0) {
      options.onTimerStop?.();
      return;
    }

    timer.current = setTimeout(updateTimer, 100);
  };

  const startTimer = useCallback(() => {
    targetTime.current = addMilliseconds(now(), milliseconds);
    options.onTimerStart?.();
    timer.current = setTimeout(updateTimer, 100);
  }, [milliseconds]);

  const stopTimer = useCallback(() => {
    clearTimeout(timer.current);
    options?.onTimerStop?.();
  }, []);

  return { time, startTimer, stopTimer };
};

export default useTimer;
