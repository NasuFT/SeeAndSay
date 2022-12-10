import { FlashList } from '@shopify/flash-list';
import { useEffect } from 'react';
import { Text } from 'react-native-paper';
import useSubmissionInfoContainer from './useSubmissionInfoContainer';

const SubmissionInfo = () => {
  const { submissions, fetchSubmissions } = useSubmissionInfoContainer();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  return (
    <FlashList
      estimatedItemSize={15}
      data={submissions}
      renderItem={({ item }) => <Text>Last 5 grades here</Text>}
    />
  );
};

export default SubmissionInfo;
