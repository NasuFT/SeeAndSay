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
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect } from 'react';
import { uploadGames } from './helper';

if (__DEV__) {
  console.log('DEV MODE');
  auth().useEmulator('http://192.168.1.7:9099');
  firestore().settings({
    persistence: false,
  });
  firestore().useEmulator('192.168.1.7', 8080);
  storage().useEmulator('192.168.1.7', 9199);
}

const AppContainer = () => {
  const { paperTheme, navigationTheme } = useTheme();

  useEffect(() => {
    const cb = async () => {
      uploadGames();
    };

    cb();
  }, []);

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
