import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { createRouterMiddleware, initialRouterState, routerReducer } from 'connected-next-router'
import Router from 'next/router'
import createSagaMiddleware from 'redux-saga'

import rootSaga from './saga'
import adminReducer from './slices/adminSlice'
import authReducer from './slices/authSlice'
import causesReducer from './slices/causesSlice'
import collectionsReducer from './slices/collectionsSlice'
import nftReducer from './slices/nftSlice'
import storageReducer from './slices/storageSlice'
import topicsReducer from './slices/topicsSlice'

const routerMiddleware = createRouterMiddleware()
const sagaMiddleware = createSagaMiddleware()
const { asPath } = Router.router || {}

const reducer = combineReducers({
  router: routerReducer,
  admin: adminReducer,
  auth: authReducer,
  collections: collectionsReducer,
  causes: causesReducer,
  storage: storageReducer,
  topics: topicsReducer,
  nft: nftReducer,
})

export const store = configureStore({
  preloadedState: {
    router: initialRouterState(asPath),
  },
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false, thunk: false })
      .concat(routerMiddleware)
      .concat(sagaMiddleware),
})
sagaMiddleware.run(rootSaga)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
