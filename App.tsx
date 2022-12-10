if (__DEV__) {
  //@ts-ignore
  import('./reactotron.config').then(() => console.log('Reactotron Configured'));
}

import 'expo-dev-client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from '@/navigators/RootNavigator';
import { NavigationBar, StatusBar } from '@/components';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import useTheme from '@/hooks/useTheme';
import { Task } from '@/types';
import { startOfToday } from 'date-fns';
import { getURL } from '@/utils/storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

if (__DEV__) {
  console.log('DEV MODE');
  auth().useEmulator('http://192.168.1.2:9099');
  firestore().settings({
    persistence: false,
  });
  firestore().useEmulator('192.168.1.2', 8080);
  storage().useEmulator('192.168.1.2', 9199);
}

const callback = async () => {
  const document = firestore().collection('tasks').doc();
  const urls = await getURL(['airplane.jpg', 'cat.jpg']);
  const newTask: Task = {
    id: document.id,
    submissionDate: startOfToday(),
    // @ts-ignore
    timestamp: firestore.FieldValue.serverTimestamp(),
    title: 'Test Task (Describe Me)',
    game: {
      type: 'describeme',
      seconds: 300,
      rounds: 2,
      data: [
        {
          imgSource: urls[0],
          answers: ['Big', 'Propeller'],
          choices: ['Big', 'Propeller', 'Not This', 'React'],
        },
        {
          imgSource: urls[1],
          answers: ['Correct Answer'],
          choices: ['Correct Answer', 'Wrong', 'Wrong', 'Ultimately Wrong'],
        },
      ],
    },
  };

  await document.set(newTask);
};

if (__DEV__) {
  callback();
}

const AppContainer = () => {
  const { paperTheme, navigationTheme } = useTheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer theme={navigationTheme}>
        <PaperProvider theme={paperTheme}>
          <RootNavigator />
          <StatusBar />
          <NavigationBar />
        </PaperProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <AppContainer />
    </Provider>
  );
}
