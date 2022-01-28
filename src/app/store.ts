import { configureStore } from '@reduxjs/toolkit';
import { spacexApi } from '../services/spacex-api';

export const store = configureStore({
  reducer: {
    [spacexApi.reducerPath]: spacexApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(spacexApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
