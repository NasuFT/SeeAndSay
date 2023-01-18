import { Screen } from '@/components';
import { RootStackScreenProps } from '@/navigators/types';
import { useRoute } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { useEffect } from 'react';
import { Text } from 'react-native-paper';
import GradeChart from './components/GradeChart';
import useSubmissionInfoContainer from './useSubmissionInfoContainer';

const SubmissionInfo = () => {
  const {
    params: { id },
  } = useRoute<RootStackScreenProps<'SubmissionInfo'>['route']>();
  const { submissions, getSubmissions } = useSubmissionInfoContainer();

  useEffect(() => {
    getSubmissions(id);
  }, []);

  return (
    <Screen style={{ alignItems: 'stretch', paddingHorizontal: 0 }}>
      <GradeChart data={submissions} style={{ height: 400 }} />
    </Screen>
  );
};

export default SubmissionInfo;
