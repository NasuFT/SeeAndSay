import * as auth from './auth';
import * as firestore from './firestore';
import * as storage from './storage';
import * as filesystem from './filesystem';
import * as clipboard from './clipboard';

const api = {
  auth,
  firestore,
  storage,
  filesystem,
  clipboard,
};

export default api;
