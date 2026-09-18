import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import storageModule from "redux-persist/lib/storage";

const storage = storageModule.default;
//1.konfigurasi persist
const persistConfig = { key: "auth", storage };

//2.bungkus reducer dengan persist reducer
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

//3. buat store yg dibungkus reducer
export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
  },
  //4 middleware agar tidak munucul pesan error data serizaiable
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

//5 export persisstore
export const persistor = persistStore(store);
