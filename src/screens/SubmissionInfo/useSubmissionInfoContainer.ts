import { getUserSubmissions } from '@/api';
import { SubmissionInfo } from '@/types';
import { useState } from 'react';

const useSubmissionInfoContainer = () => {
  const [submissions, setSubmissions] = useState<SubmissionInfo[]>([]);
  const getSubmissions = async (userId: string) => {
    const submissions = await getUserSubmissions(userId, 5);
    setSubmissions(submissions);
  };

  return { submissions, getSubmissions };
};

export default useSubmissionInfoContainer;
