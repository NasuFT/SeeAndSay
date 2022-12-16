import React from 'react';
import { useNavigation } from '@react-navigation/native';

import { RootStackScreenProps } from '@/navigators/types';
import useGameContainer from './useGameContainer';
import Classic from './screens/Classic';
import FourPicsOneWord from './screens/FourPicsOneWord';
import DescribeMe from './screens/DescribeMe';
import Puzzle from './screens/Puzzle';
import ScavengerHunt from './screens/ScavengerHunt';

const Game = () => {
  const { selectedTask, imageSources, setSubmissions, uploadSubmission, setTime } =
    useGameContainer();
  const { game } = selectedTask;
  const { type } = game;

  const navigation = useNavigation<RootStackScreenProps<'Game'>['navigation']>();
  const handleSubmit = async (answers: any[], time: number) => {
    setSubmissions(answers);
    setTime(time);
    await uploadSubmission();
    navigation.pop();
  };

  if (type === 'classic') {
    return <Classic game={game} images={imageSources} onSubmit={handleSubmit} />;
  } else if (type === 'fourpicsoneword') {
    return <FourPicsOneWord game={game} imageSources={imageSources} onSubmit={handleSubmit} />;
  } else if (type === 'describeme') {
    return <DescribeMe game={game} images={imageSources} onSubmit={handleSubmit} />;
  } else if (type === 'puzzle') {
    return <Puzzle game={game} images={imageSources} onSubmit={handleSubmit} />;
  } else if (type === 'scavengerhunt') {
    return <ScavengerHunt game={game} images={imageSources} onSubmit={handleSubmit} />;
  }
  return null;
};

export default Game;
