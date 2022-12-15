import { Screen } from '@/components';
import { FlashList } from '@shopify/flash-list';
import { useEffect } from 'react';
import { Text } from 'react-native-paper';
import GradeChart from './components/GradeChart';
import useSubmissionInfoContainer from './useSubmissionInfoContainer';

const SubmissionInfo = () => {
  const { submissions, fetchSubmissions } = useSubmissionInfoContainer();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  return (
    <Screen style={{ alignItems: 'stretch', paddingHorizontal: 0 }}>
      <GradeChart data={submissions} style={{ height: 400 }} />
    </Screen>
  );
};

export default SubmissionInfo;
