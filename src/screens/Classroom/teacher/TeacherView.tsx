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
import { List } from 'react-native-paper';

const TeacherView = () => {
  const { enrollees, fetchEnrolls, setEnrollee, grades, fetchGrades } = useTeacherView();

  useEffect(() => {
    fetchEnrolls();
    fetchGrades();
  }, []);

  const navigation = useNavigation<RootStackScreenProps<'Classroom'>['navigation']>();
  const handlePress = (data: Enroll) => {
    setEnrollee(data);
    navigation.navigate('SubmissionInfo');
  };

  return (
    <Screen style={{ alignItems: 'stretch', paddingHorizontal: 0 }}>
      <AverageGradeChart data={grades} style={{ height: 320 }} title="Student Grades for Daily Task" />
      <View style={{ height: 24 }} />
      <List.Subheader>Students</List.Subheader>
      <EnrollList data={enrollees} onItemPress={(_, data) => handlePress(data)} />
    </Screen>
  );
};

export default TeacherView;
