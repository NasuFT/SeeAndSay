import { View } from 'react-native';
import React, { useMemo, useState } from 'react';
import { Screen } from '@/components';
import useTeacherView from './useTeacherView';
import EnrollList from '../components/EnrollList';
import { useEffect } from 'react';
import { User } from '@/types';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootStackScreenProps } from '@/navigators/types';
import AverageGradeChart from '../components/AverageGradeChart';
import { Button, IconButton, List, Text } from 'react-native-paper';
import DataTable from '../components/DataTable';

const TeacherView = () => {
  const navigation = useNavigation<RootStackScreenProps<'Classroom'>['navigation']>();
  const {
    params: { id },
  } = useRoute<RootStackScreenProps<'Classroom'>['route']>();
  const {
    students,
    getStudents,
    submissions,
    getSubmissions,
    dailyTask,
    getDailyTask,
    classroom,
    getClassroom,
  } = useTeacherView();

  useEffect(() => {
    getStudents(id);
    getDailyTask();
    getClassroom(id);
  }, []);

  useEffect(() => {
    if (dailyTask) {
      getSubmissions(dailyTask.id, id);
    }
  }, [dailyTask]);

  const grades = useMemo(() => submissions.map((item) => item.grade), [submissions]);

  const handlePress = (data: User) => {
    navigation.navigate('SubmissionInfo', { id: data.id });
  };

  const [isTable, setIsTable] = useState(false);

  return (
    <Screen withBackground>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <IconButton
          icon="arrow-left"
          size={24}
          style={{
            borderColor: '#facd89',
            borderWidth: 2,
            marginLeft: 16,
          }}
          mode="contained"
          containerColor="#3c5e47"
          iconColor="#ffffff"
          onPress={() => navigation.goBack()}
        />
        <Button
          icon={isTable ? 'chart-bar' : 'table'}
          style={{ marginRight: 16 }}
          mode="contained"
          onPress={() => setIsTable((table) => !table)}>
          {isTable ? `View Chart` : `View Table`}
        </Button>
      </View>
      {isTable ? (
        <>
          <Text
            variant="bodyLarge"
            style={{
              color: '#ffffff',
              borderWidth: 4,
              borderColor: '#facd89',
              backgroundColor: '#3c5e47',
              includeFontPadding: false,
              textAlignVertical: 'center',
              margin: 8,
              alignSelf: 'flex-start',
              textAlign: 'left',
              paddingVertical: 8,
              paddingHorizontal: 16,
            }}>
            {classroom === null ? '' : classroom.name}
          </Text>
          <DataTable
            submissions={submissions}
            students={students}
            style={{
              borderWidth: 4,
              borderColor: '#facd89',
              backgroundColor: '#3c5e47',
              margin: 8,
              width: undefined,
            }}
          />
        </>
      ) : (
        <>
          <AverageGradeChart
            data={grades}
            style={{
              height: 350,
              borderWidth: 4,
              borderColor: '#facd89',
              backgroundColor: '#3c5e47',
              margin: 16,
              paddingBottom: 16,
            }}
            titleStyle={{
              color: '#ffffff',
            }}
            title="Student Grades for Daily Task"
          />
          <View
            style={{
              borderWidth: 4,
              borderColor: '#facd89',
              backgroundColor: '#3c5e47',
              flex: 1,
              marginHorizontal: 24,
              marginTop: 16,
              marginBottom: 24,
            }}>
            <List.Subheader style={{ marginTop: 24, color: '#ffffff' }}>Students</List.Subheader>
            <EnrollList
              data={students}
              onItemPress={(_, data) => handlePress(data)}
              textStyle={{ color: '#ffffff' }}
            />
          </View>
        </>
      )}
    </Screen>
  );
};

export default TeacherView;
