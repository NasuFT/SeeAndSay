import { View, Text } from 'react-native';
import React from 'react';
import { Screen } from '@/components';
import useTeacherView from './useTeacherView';
import EnrollList from '../components/EnrollList';
import { useEffect } from 'react';
import { Enroll } from '@/types';
import { useNavigation } from '@react-navigation/native';
import { RootStackScreenProps } from '@/navigators/types';
import AverageGradeChart from '../components/AverageGradeChart';

const TeacherView = () => {
  const { enrollees, fetchEnrolls, setEnrollee, grades } = useTeacherView();

  useEffect(() => {
    fetchEnrolls();
  }, []);

  const navigation = useNavigation<RootStackScreenProps<'Classroom'>['navigation']>();
  const handlePress = (data: Enroll) => {
    setEnrollee(data);
    navigation.navigate('SubmissionInfo');
  };

  return (
    <Screen style={{ alignItems: 'stretch', paddingHorizontal: 0 }}>
      <AverageGradeChart data={grades} style={{ height: 320 }} />
      <EnrollList data={enrollees} onItemPress={(_, data) => handlePress(data)} />
    </Screen>
  );
};

export default TeacherView;
