import { View } from 'react-native';
import React, { useMemo } from 'react';
import { Screen } from '@/components';
import useTeacherView from './useTeacherView';
import EnrollList from '../components/EnrollList';
import { useEffect } from 'react';
import { Enroll, User } from '@/types';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootStackScreenProps } from '@/navigators/types';
import AverageGradeChart from '../components/AverageGradeChart';
import { List } from 'react-native-paper';

const TeacherView = () => {
  const navigation = useNavigation<RootStackScreenProps<'Classroom'>['navigation']>();
  const {
    params: { id },
  } = useRoute<RootStackScreenProps<'Classroom'>['route']>();
  const { students, getStudents, submissions, getSubmissions, dailyTask, getDailyTask } =
    useTeacherView();

  useEffect(() => {
    getStudents(id);
    getDailyTask();
  }, []);

  useEffect(() => {
    if (dailyTask) {
      getSubmissions(dailyTask.id);
    }
  }, [dailyTask]);

  const grades = useMemo(() => submissions.map((item) => item.grade), [submissions]);

  const handlePress = (data: User) => {
    navigation.navigate('SubmissionInfo', { id: data.id });
  };

  return (
    <Screen style={{ alignItems: 'stretch', paddingHorizontal: 0 }}>
      <AverageGradeChart
        data={grades}
        style={{ height: 320 }}
        title="Student Grades for Daily Task"
      />
      <View style={{ height: 24 }} />
      <List.Subheader>Students</List.Subheader>
      <EnrollList data={students} onItemPress={(_, data) => handlePress(data)} />
    </Screen>
  );
};

export default TeacherView;
