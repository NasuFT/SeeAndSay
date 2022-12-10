import Reactotron from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default Reactotron.setAsyncStorageHandler(AsyncStorage)
  .configure({
    name: 'See And Say',
  })
  .useReactNative()
  .use(reactotronRedux())
  .connect();
