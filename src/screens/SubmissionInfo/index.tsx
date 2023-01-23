import { Screen } from '@/components';
import { RootStackScreenProps } from '@/navigators/types';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { useEffect } from 'react';
import { View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
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

  const navigation = useNavigation<RootStackScreenProps<'SubmissionInfo'>['navigation']>();

  return (
    <Screen withBackground>
      <IconButton
        icon="arrow-left"
        size={24}
        style={{
          alignSelf: 'flex-start',
          borderColor: '#facd89',
          borderWidth: 2,
          marginLeft: 16,
        }}
        mode="contained"
        containerColor="#3c5e47"
        iconColor="#ffffff"
        onPress={() => navigation.goBack()}
      />
      <GradeChart
        data={submissions}
        style={{
          height: 400,
          borderWidth: 4,
          borderColor: '#facd89',
          backgroundColor: '#3c5e47',
          margin: 16,
          paddingBottom: 16,
        }}
      />
    </Screen>
  );
};

export default SubmissionInfo;
