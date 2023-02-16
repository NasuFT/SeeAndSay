import React, { useCallback, useEffect } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { RootStackScreenProps } from '@/navigators/types';
import useGameContainer from './useGameContainer';
import Classic from './screens/Classic';
import FourPicsOneWord from './screens/FourPicsOneWord';
import DescribeMe from './screens/DescribeMe';
import Puzzle from './screens/Puzzle';
import ScavengerHunt from './screens/ScavengerHunt';
import { BackHandler } from 'react-native';
import { SubmissionData } from '@/types';

const Game = () => {
  const { dailyTask, imageSources, setSubmission, uploadSubmission, finishScreen } =
    useGameContainer();
  const { game } = dailyTask;
  const { type } = game;

  const navigation = useNavigation<RootStackScreenProps<'Game'>['navigation']>();
  const handleSubmit = async (answers: SubmissionData, time: number) => {
    setSubmission({
      data: answers,
      time,
    });
    await uploadSubmission();
    finishScreen();
    navigation.pop();
  };

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      const handler = () => true;

      const subscription = BackHandler.addEventListener('hardwareBackPress', handler);

      return subscription.remove;
    }, [])
  );

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
