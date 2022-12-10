import { GameInfo } from '@/types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useTimer from './useTimer';

const useGame = (game: GameInfo) => {
  const timer = useTimer(game.seconds * 1000);
  const [round, setRound] = useState(1);
  const isFinalRound = useMemo(() => round === game.rounds, [round]);
  const { type, data } = game;

  if (type === 'classic') {
    const [answer, _setAnswer] = useState('');
    const answerRef = useRef(answer);
    const setAnswer = (answer: string) => {
      answerRef.current = answer;
      _setAnswer(answer);
    };
    const handleNext = useCallback(
      (onNextHandler: (answer: string) => void) => () => {
        setRound((round) => round + (isFinalRound ? 0 : 1));
        onNextHandler(answerRef.current);
        setAnswer('');
      },
      [isFinalRound]
    );

    const currentGameItem = useMemo(() => data[round - 1], [round]);

    return { type, timer, round, handleNext, currentGameItem, answer, setAnswer };
  } else if (type === 'fourpicsoneword') {
    const handleNext = useCallback(
      (onNextHandler: (answer: string) => void) => {
        setRound((round) => round + (isFinalRound ? 0 : 1));
        return onNextHandler;
      },
      [isFinalRound]
    );

    const currentGameItem = useMemo(() => data[round - 1], [round]);

    return { type, timer, round, handleNext, currentGameItem };
  } else {
    const handleNext = useCallback(
      (onNextHandler: (answers: string[]) => void) => {
        setRound((round) => round + (isFinalRound ? 0 : 1));
        return onNextHandler;
      },
      [isFinalRound]
    );

    const currentGameItem = useMemo(() => data[round - 1], [round]);

    return { type, timer, round, handleNext, currentGameItem };
  }
};

export default useGame;
