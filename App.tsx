import 'expo-dev-client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import { PaperLightTheme, NavigationLightTheme } from '@/theme';
import { Provider as PaperProvider } from 'react-native-paper';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

if (__DEV__) {
  require('./reactotron.config.js').then(() => console.log('Reactotron configured'));
}

const AppContainer = () => {
  return (
    <NavigationContainer theme={NavigationLightTheme}>
      <PaperProvider theme={PaperLightTheme}>
        <View />
      </PaperProvider>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <AppContainer />
    </Provider>
  );
}
