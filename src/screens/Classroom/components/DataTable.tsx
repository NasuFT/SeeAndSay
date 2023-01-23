import { GameType, SubmissionInfo, User } from '@/types';
import { format } from 'date-fns';
import { useMemo } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { DataTable as Table } from 'react-native-paper';

interface Props {
  submissions: SubmissionInfo[];
  students: User[];
  style?: StyleProp<ViewStyle>;
}

const getGameTypeTitle = (type: GameType) => {
  return type === 'classic'
    ? 'Classic'
    : type === 'describeme'
    ? 'Describe Me'
    : type === 'fourpicsoneword'
    ? 'Four Pics One Word'
    : type === 'puzzle'
    ? 'Puzzle'
    : // type === 'scavengerhunt'
      'Scavenger Hunt';
};

const DataTable = ({ submissions, students, style }: Props) => {
  const sortedStudentIDs = useMemo(
    () =>
      students.slice().sort((a, b) => {
        const lastNameCompare = a.lastName.localeCompare(b.lastName);

        if (lastNameCompare !== 0) {
          return lastNameCompare;
        }

        const firstNameCompare = a.firstName.localeCompare(b.firstName);

        return firstNameCompare;
      }),
    [students]
  );

  const sortedSubmissions = useMemo(
    () =>
      sortedStudentIDs.map((student) => {
        const studentSubmission = submissions.find(
          (submission) => submission.user.id === student.id
        ) as SubmissionInfo;

        return {
          ...studentSubmission,
          user: {
            ...studentSubmission.user,
            firstName: student.firstName,
            lastName: student.lastName,
          },
        };
      }),
    [submissions, sortedStudentIDs]
  );

  return (
    <Table style={style}>
      <Table.Header>
        <Table.Title style={{ flex: 3 }} textStyle={{ color: '#ffffff' }}>
          Name
        </Table.Title>
        <Table.Title style={{ flex: 1.5 }} textStyle={{ color: '#ffffff' }}>
          Game Type
        </Table.Title>
        <Table.Title style={{ flex: 1.5 }} textStyle={{ color: '#ffffff' }} numeric>
          Date
        </Table.Title>
        <Table.Title style={{ flex: 1 }} textStyle={{ color: '#ffffff' }} numeric>
          Grade
        </Table.Title>
      </Table.Header>
      {sortedSubmissions.map((submission) => (
        <Table.Row key={submission.id}>
          <Table.Cell
            style={{ flex: 3 }}
            textStyle={{
              color: '#ffffff',
            }}>{`${submission.user.lastName}, ${submission.user.firstName}`}</Table.Cell>
          <Table.Cell
            style={{ flex: 1.5 }}
            textStyle={{
              color: '#ffffff',
            }}>
            {getGameTypeTitle(submission.type)}
          </Table.Cell>
          <Table.Cell
            style={{ flex: 1.5 }}
            numeric
            textStyle={{
              color: '#ffffff',
            }}>
            {format(submission.task.submissionDate, 'dd-MM-yy')}
          </Table.Cell>
          <Table.Cell
            style={{ flex: 1 }}
            numeric
            textStyle={{
              color: '#ffffff',
            }}>
            {submission.grade.toFixed(2)}
          </Table.Cell>
        </Table.Row>
      ))}
    </Table>
  );
};

export default DataTable;
