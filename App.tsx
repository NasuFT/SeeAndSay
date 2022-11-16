import { Provider } from 'react-redux';
import { store } from '@/store';
import { NavigationContainer } from '@react-navigation/native';
import { NavigationLightTheme, PaperLightTheme } from '@/theme';
import { Provider as PaperProvider } from 'react-native-paper';
import RootNavigator from '@/navigators/RootNavigator';

if (__DEV__) {
  require('./reactotron.config.js').then(() => console.log('Reactotron configured'));
}

const AppContainer = () => {
  return (
    <NavigationContainer theme={NavigationLightTheme}>
      <PaperProvider theme={PaperLightTheme}>
        <RootNavigator />
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
